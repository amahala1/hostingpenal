import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from '../config.js';

const execAsync = promisify(execFile);
const publicUrl = (host) => `https://${host}`;

async function commandAvailable(command) {
  try { await execAsync('sh', ['-lc', `command -v ${command}`], { timeout: 5000 }); return true; }
  catch { return false; }
}
async function serviceActive(service) {
  try { await execAsync('systemctl', ['is-active', '--quiet', service], { timeout: 5000 }); return true; }
  catch { return false; }
}
async function fileExists(filePath) {
  try { await fs.access(filePath); return true; }
  catch { return false; }
}

export async function getIntegrationStatus() {
  const [mysql, mariadb, php, postfix, dovecot, nginx] = await Promise.all([
    commandAvailable('mysql'), commandAvailable('mariadb'), commandAvailable('php'),
    serviceActive('postfix'), serviceActive('dovecot'), serviceActive('nginx'),
  ]);
  const [phpMyAdminInstalled, roundcubeInstalled] = await Promise.all([
    fileExists(config.phpMyAdminRoot), fileExists(config.roundcubeRoot) || fileExists('/usr/share/roundcube'),
  ]);
  return {
    phpMyAdmin: { installed: phpMyAdminInstalled, databaseReady: mysql || mariadb, phpReady: php, nginxReady: nginx, url: publicUrl(config.phpMyAdminHost) },
    roundcube: { installed: roundcubeInstalled, imapReady: dovecot, smtpReady: postfix, phpReady: php, nginxReady: nginx, url: publicUrl(config.webmailHost) },
  };
}
