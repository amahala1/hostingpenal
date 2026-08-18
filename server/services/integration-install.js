import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config } from '../config.js';

const exec = promisify(execFile);

const PACKAGES = {
  phpMyAdmin: ['phpmyadmin'],
  roundcube: ['roundcube', 'roundcube-core', 'roundcube-mysql'],
};

function requireRoot() {
  if (process.getuid?.() !== 0) throw new Error('Integration installation requires a privileged worker');
}

export function getInstallPlan(name) {
  const packages = PACKAGES[name];
  if (!packages) throw new Error('Unsupported integration');
  return { integration: name, packages };
}

async function packageInstalled(pkg) {
  try {
    await exec('dpkg-query', ['-W', '-f=${Status}', pkg], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function installPackages(packages) {
  await exec('apt-get', ['update'], { timeout: 10 * 60 * 1000, maxBuffer: 4 * 1024 * 1024 });
  await exec('env', ['DEBIAN_FRONTEND=noninteractive', 'apt-get', 'install', '-y', ...packages], {
    timeout: 15 * 60 * 1000,
    maxBuffer: 8 * 1024 * 1024,
  });
}

function renderIntegrationServer({ host, root, phpSocket }) {
  return `server {\n  listen 80;\n  listen [::]:80;\n  server_name ${host};\n  root ${root};\n  index index.php index.html;\n\n  location / {\n    try_files $uri $uri/ /index.php?$query_string;\n  }\n\n  location ~ \\.php$ {\n    include snippets/fastcgi-php.conf;\n    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n    fastcgi_pass unix:${phpSocket};\n  }\n\n  location ~ /\\. { deny all; }\n}\n`;
}

async function configureNginx({ name }) {
  const isPhpMyAdmin = name === 'phpMyAdmin';
  const host = isPhpMyAdmin ? config.phpMyAdminHost : config.webmailHost;
  const root = isPhpMyAdmin ? config.phpMyAdminRoot : config.roundcubeRoot;
  const file = path.join(config.integrationSitesAvailable, `${isPhpMyAdmin ? 'phpmyadmin' : 'roundcube'}.conf`);
  const enabled = path.join(config.integrationSitesEnabled, path.basename(file));
  await fs.access(root);
  await fs.writeFile(file, renderIntegrationServer({ host, root, phpSocket: config.defaultPhpSocket }), { mode: 0o644 });
  await fs.rm(enabled, { force: true });
  await fs.symlink(file, enabled);
  await exec(config.nginxBinary, ['-t'], { timeout: 10000 });
  await exec(config.nginxBinary, ['-s', 'reload'], { timeout: 10000 });
  return { host, root, nginxConfig: file, url: `http://${host}` };
}

export async function installIntegration(name, { execute = false, configure = true } = {}) {
  const plan = getInstallPlan(name);
  if (!execute) return { success: true, dryRun: true, ...plan, configure };
  requireRoot();
  const missing = [];
  for (const pkg of plan.packages) {
    if (!(await packageInstalled(pkg))) missing.push(pkg);
  }
  if (missing.length) await installPackages(missing);
  const nginx = configure ? await configureNginx({ name }) : null;
  return { success: true, installed: true, integration: name, packages: plan.packages, nginx };
}
