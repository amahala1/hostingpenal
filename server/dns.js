import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.js';

const execFileAsync = promisify(execFile);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const namePattern = /^(?:@|[a-zA-Z0-9*_-]+(?:\.[a-zA-Z0-9*_-]+)*)$/;
const ipv4Pattern = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const recordTypes = new Set(['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'SRV', 'CAA']);

function validateDomain(domain) {
  if (!domainPattern.test(domain)) throw new Error('Invalid domain name');
}

function validateRecord(record) {
  if (!recordTypes.has(record.type)) throw new Error('Unsupported DNS record type');
  if (!namePattern.test(record.name)) throw new Error('Invalid DNS record name');
  if (!record.value || /[\r\n]/.test(record.value)) throw new Error('Invalid DNS record value');
  if (!Number.isInteger(record.ttl) || record.ttl < 60 || record.ttl > 86400) throw new Error('TTL must be between 60 and 86400');
  if (record.type === 'A' && !ipv4Pattern.test(record.value)) throw new Error('Invalid IPv4 address');
  if (record.type === 'MX' && (!Number.isInteger(record.priority) || record.priority < 0 || record.priority > 65535)) throw new Error('Invalid MX priority');
}

function fqdn(name, domain) {
  return name === '@' ? `${domain}.` : `${name.replace(/\.$/, '')}.${domain}.`;
}

function escapeTxt(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function renderRecord(record, domain) {
  const owner = fqdn(record.name, domain).padEnd(40);
  const ttl = String(record.ttl).padEnd(6);
  const value = record.type === 'TXT' || record.type === 'CAA' ? `"${escapeTxt(record.value)}"` : record.value;
  const priority = record.type === 'MX' || record.type === 'SRV' ? `${record.priority ?? 10} ` : '';
  return `${owner} ${ttl} IN ${record.type} ${priority}${value}`;
}

function zoneDeclaration(domain) {
  const zonePath = path.join(config.bindZoneDir, `db.${domain}`);
  return `zone "${domain}" {\n  type master;\n  file "${zonePath}";\n};`;
}

async function ensureZoneDeclaration(domain) {
  const localPath = '/etc/bind/named.conf.local';
  let content;
  try {
    content = await fs.readFile(localPath, 'utf8');
  } catch (error) {
    throw new Error(`Unable to read BIND local configuration: ${error?.message || error}`);
  }

  const declaration = zoneDeclaration(domain);
  const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const zonePattern = new RegExp(`\\bzone\\s+"${escapedDomain}"\\s*\\{`, 'i');
  if (!zonePattern.test(content)) {
    const separator = content.endsWith('\n') ? '' : '\n';
    await fs.writeFile(localPath, `${content}${separator}\n${declaration}\n`, 'utf8');
  }
}

async function reloadBind() {
  await execFileAsync('named-checkconf');
  await execFileAsync('rndc', ['reload']);
}

function nextSerial(existingContent) {
  const match = existingContent.match(/@\s+IN\s+SOA[\s\S]*?\(\s*(\d+)/i);
  const current = match ? Number(match[1]) : 0;
  return Math.max(Math.floor(Date.now() / 1000), current + 1);
}

export async function writeZone(domain, records) {
  validateDomain(domain);
  records.forEach(validateRecord);
  await fs.mkdir(config.bindZoneDir, { recursive: true, mode: 0o775 });
  await ensureZoneDeclaration(domain);

  const serial = Math.floor(Date.now() / 1000);
  const lines = [
    `$TTL 300`,
    `@ IN SOA ns1.${domain}. hostmaster.${domain}. (`,
    `  ${serial} 3600 900 604800 300`,
    `)`,
    `@ IN NS ns1.${domain}.`,
    `@ IN NS ns2.${domain}.`,
    ...records.map((record) => renderRecord(record, domain)),
    '',
  ];
  const zonePath = path.join(config.bindZoneDir, `db.${domain}`);
  await fs.writeFile(zonePath, lines.join('\n'), { mode: 0o644 });
  await execFileAsync('named-checkzone', [domain, zonePath]);
  await reloadBind();
  return { zonePath, serial };
}

export async function upsertZoneRecord(domain, record) {
  validateDomain(domain);
  validateRecord(record);
  const zonePath = path.join(config.bindZoneDir, `db.${domain}`);
  let content;
  try {
    content = await fs.readFile(zonePath, 'utf8');
  } catch {
    throw new Error(`DNS zone does not exist for ${domain}`);
  }

  const rendered = renderRecord(record, domain);
  const normalized = rendered.replace(/\s+/g, ' ').trim();
  const exists = content.split('\n').some((line) => line.replace(/\s+/g, ' ').trim() === normalized);

  if (!exists) {
    const serial = nextSerial(content);
    const serialPattern = /(@\s+IN\s+SOA[\s\S]*?\(\s*)\d+/i;
    content = content.replace(serialPattern, `$1${serial}`);
    content = `${content.trimEnd()}\n${rendered}\n`;
    await fs.writeFile(zonePath, content, { mode: 0o644 });
  }

  await ensureZoneDeclaration(domain);
  await execFileAsync('named-checkzone', [domain, zonePath]);
  await reloadBind();
  return { zonePath, added: !exists };
}

export async function readZone(domain) {
  validateDomain(domain);
  const zonePath = path.join(config.bindZoneDir, `db.${domain}`);
  return fs.readFile(zonePath, 'utf8');
}
