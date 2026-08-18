import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from './config.js';

const execFileAsync = promisify(execFile);
const domainPattern = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/;
const usernamePattern = /^[a-z][a-z0-9_-]{2,31}$/;

function validateDomain(domain) {
  if (!domainPattern.test(domain)) throw new Error('Invalid domain name');
}

function validateUsername(username) {
  if (!usernamePattern.test(username)) throw new Error('Invalid hosting username');
}

function shellSafePath(value) {
  return path.resolve(value);
}

export function getDocumentRoot(username, domain) {
  validateUsername(username);
  validateDomain(domain);
  const root = shellSafePath(path.join(config.hostingHome, username, 'public_html', domain));
  const allowed = shellSafePath(path.join(config.hostingHome, username, 'public_html')) + path.sep;
  if (!root.startsWith(allowed)) throw new Error('Unsafe document root');
  return root;
}

export function renderNginxServerBlock({ domain, username, phpSocket }) {
  validateDomain(domain);
  validateUsername(username);
  const root = getDocumentRoot(username, domain);
  const socket = phpSocket || config.defaultPhpSocket;
  return `server {\n  listen 80;\n  listen [::]:80;\n  server_name ${domain} www.${domain};\n  root ${root};\n  index index.php index.html index.htm;\n\n  location / {\n    try_files $uri $uri/ /index.php?$query_string;\n  }\n\n  location ~ \\.php$ {\n    include snippets/fastcgi-php.conf;\n    fastcgi_pass unix:${socket};\n  }\n\n  location ~ /\\.(?!well-known).* {\n    deny all;\n  }\n}\n`;
}

export async function provisionDomain({ domain, username, phpSocket }) {
  validateDomain(domain);
  validateUsername(username);
  const documentRoot = getDocumentRoot(username, domain);
  await fs.mkdir(documentRoot, { recursive: true, mode: 0o755 });

  const indexPath = path.join(documentRoot, 'index.html');
  try {
    await fs.access(indexPath);
  } catch {
    await fs.writeFile(indexPath, `<!doctype html><html><head><meta charset="utf-8"><title>${domain}</title></head><body><h1>${domain}</h1><p>Website ready.</p></body></html>\n`, { mode: 0o644 });
  }

  const nginxPath = path.join(config.nginxSitesAvailable, `${domain}.conf`);
  const nginxEnabledPath = path.join(config.nginxSitesEnabled, `${domain}.conf`);
  await fs.writeFile(nginxPath, renderNginxServerBlock({ domain, username, phpSocket }), { mode: 0o644 });
  await fs.rm(nginxEnabledPath, { force: true });
  await fs.symlink(nginxPath, nginxEnabledPath);

  await execFileAsync(config.nginxBinary, ['-t']);
  await execFileAsync(config.nginxReloadBinary, ['reload']);

  return { domain, username, documentRoot, nginxPath, enabled: true };
}
