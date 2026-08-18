import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const exec = promisify(execFile);

const COMMANDS = {
  phpMyAdmin: {
    debian: ['apt-get', ['install', '-y', 'phpmyadmin']],
    route: '/phpmyadmin',
  },
  roundcube: {
    debian: ['apt-get', ['install', '-y', 'roundcube', 'roundcube-core', 'roundcube-mysql']],
    route: '/webmail',
  },
};

export function getInstallPlan(name) {
  if (!COMMANDS[name]) throw new Error('Unsupported integration');
  return COMMANDS[name];
}

/**
 * Installation is deliberately explicit and root-only. The panel should call
 * this from a restricted privileged worker, never from an untrusted HTTP
 * request. Package installation is not silently executed by the API.
 */
export async function installIntegration(name, { execute = false } = {}) {
  const plan = getInstallPlan(name);
  if (!execute) return { success: true, dryRun: true, integration: name, route: plan.route, command: plan.debian };

  if (process.getuid?.() !== 0) throw new Error('Integration installation requires a privileged worker');
  const [command, args] = plan.debian;
  await exec(command, args, { timeout: 10 * 60 * 1000, maxBuffer: 1024 * 1024 * 4 });
  return { success: true, installed: true, integration: name, route: plan.route };
}
