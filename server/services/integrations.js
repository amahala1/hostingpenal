import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(execFile);

async function commandAvailable(command) {
  try {
    await execAsync('sh', ['-lc', `command -v ${command}`], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

async function serviceActive(service) {
  try {
    await execAsync('systemctl', ['is-active', '--quiet', service], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

export async function getIntegrationStatus() {
  const [mysql, mariadb, php, postfix, dovecot, nginx] = await Promise.all([
    commandAvailable('mysql'),
    commandAvailable('mariadb'),
    commandAvailable('php'),
    serviceActive('postfix'),
    serviceActive('dovecot'),
    serviceActive('nginx'),
  ]);

  const phpMyAdminInstalled = await fileExists('/usr/share/phpmyadmin');
  const roundcubeInstalled = await fileExists('/var/lib/roundcube') || await fileExists('/usr/share/roundcube');

  return {
    phpMyAdmin: {
      installed: phpMyAdminInstalled,
      databaseReady: mysql || mariadb,
      phpReady: php,
      route: '/phpmyadmin',
    },
    roundcube: {
      installed: roundcubeInstalled,
      imapReady: dovecot,
      smtpReady: postfix,
      phpReady: php,
      route: '/webmail',
    },
    nginx: { active: nginx },
  };
}

async function fileExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}
