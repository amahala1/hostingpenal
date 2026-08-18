import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.js';
import { writeZone } from './dns.js';

const execFileAsync = promisify(execFile);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const usernamePattern = /^[a-z][a-z0-9_-]{2,31}$/;

function validateDomain(domain) {
  if (!domainPattern.test(domain)) throw new Error('Invalid domain name');
}
function validateUsername(username) {
  if (!usernamePattern.test(username)) throw new Error('Invalid hosting username');
}
function shellSafePath(value) { return path.resolve(value); }

export function getDocumentRoot(username, domain) {
  validateUsername(username); validateDomain(domain);
  const root = shellSafePath(path.join(config.hostingHome, username, 'public_html', domain));
  const allowed = shellSafePath(path.join(config.hostingHome, username, 'public_html')) + path.sep;
  if (!root.startsWith(allowed)) throw new Error('Unsafe document root');
  return root;
}

export function renderNginxServerBlock({ domain, username, phpSocket }) {
  validateDomain(domain); validateUsername(username);
  const root = getDocumentRoot(username, domain);
  const socket = phpSocket || config.defaultPhpSocket;
  return `server {\n  listen 80;\n  listen [::]:80;\n  server_name ${domain} www.${domain};\n  root ${root};\n  index index.php index.html index.htm;\n\n  location / { try_files $uri $uri/ /index.php?$query_string; }\n  location ~ \\.php$ { include snippets/fastcgi-php.conf; fastcgi_pass unix:${socket}; }\n  location ~ /\\.(?!well-known).* { deny all; }\n}\n`;
}

async function commandExists(command) {
  try { await execFileAsync('sh', ['-lc', `command -v ${command}`]); return true; } catch { return false; }
}

async function issueLetsEncrypt(domain) {
  if (!(await commandExists('certbot'))) return { status: 'pending', message: 'certbot is not installed; SSL provisioning is pending.' };
  try {
    await execFileAsync('certbot', ['--nginx', '--non-interactive', '--agree-tos', '--redirect', '--register-unsafely-without-email', '-d', domain, '-d', `www.${domain}`], { timeout: 120000 });
    return { status: 'active', message: "Let's Encrypt certificate issued and HTTPS redirect enabled." };
  } catch (error) { return { status: 'pending', message: error?.message || "Let's Encrypt provisioning failed." }; }
}

function defaultDnsRecords(domain, serverIp) {
  return [
    { name: '@', type: 'A', value: serverIp, ttl: 3600 },
    { name: 'www', type: 'CNAME', value: domain, ttl: 3600 },
    { name: 'mail', type: 'A', value: serverIp, ttl: 3600 },
    { name: 'ftp', type: 'A', value: serverIp, ttl: 3600 },
    { name: 'webmail', type: 'A', value: serverIp, ttl: 3600 },
    { name: '@', type: 'MX', value: `mail.${domain}.`, priority: 10, ttl: 3600 },
    { name: '@', type: 'TXT', value: `v=spf1 a mx ip4:${serverIp} ~all`, ttl: 3600 },
    { name: '_dmarc', type: 'TXT', value: `v=DMARC1; p=none; rua=mailto:postmaster@${domain}`, ttl: 3600 },
  ];
}

export async function provisionDomain({ domain, username, phpSocket, serverIp, issueSsl = false }) {
  validateDomain(domain); validateUsername(username);
  const documentRoot = getDocumentRoot(username, domain);
  await fs.mkdir(documentRoot, { recursive: true, mode: 0o755 });

  const indexPath = path.join(documentRoot, 'index.html');
  try { await fs.access(indexPath); } catch {
    await fs.writeFile(indexPath, `<!doctype html><html><head><meta charset="utf-8"><title>${domain}</title></head><body><h1>${domain}</h1><p>Website ready.</p></body></html>\n`, { mode: 0o644 });
  }

  const nginxPath = path.join(config.nginxSitesAvailable, `${domain}.conf`);
  const nginxEnabledPath = path.join(config.nginxSitesEnabled, `${domain}.conf`);
  await fs.writeFile(nginxPath, renderNginxServerBlock({ domain, username, phpSocket }), { mode: 0o644 });
  await fs.rm(nginxEnabledPath, { force: true });
  await fs.symlink(nginxPath, nginxEnabledPath);
  await execFileAsync(config.nginxBinary, ['-t']);
  await execFileAsync(config.nginxBinary, ['-s', 'reload']);

  let dns = { status: 'skipped' };
  if (serverIp) dns = { status: 'active', ...(await writeZone(domain, defaultDnsRecords(domain, serverIp))) };
  const ssl = issueSsl ? await issueLetsEncrypt(domain) : { status: 'not-requested' };
  return { domain, username, documentRoot, nginxPath, enabled: true, dns, ssl };
}
