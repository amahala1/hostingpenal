import { provisionDomain } from './provisioning.js';
import { writeZone } from './dns.js';

/**
 * Orchestrates the hosting flow in the same predictable order as a control panel:
 * account -> document root -> DNS -> Nginx -> verification.
 * The actual account/user creation is intentionally delegated to the server's
 * privileged provisioning layer; this module only coordinates safe operations.
 */
export async function provisionHostingAccount({ domain, username, records = [], phpSocket }) {
  const normalizedDomain = String(domain || '').trim().toLowerCase();
  const normalizedUsername = String(username || '').trim().toLowerCase();

  const dns = await writeZone(normalizedDomain, records);
  const web = await provisionDomain({
    domain: normalizedDomain,
    username: normalizedUsername,
    phpSocket,
  });

  return {
    success: true,
    account: {
      username: normalizedUsername,
      domain: normalizedDomain,
      documentRoot: web.documentRoot,
    },
    dns,
    web,
    status: 'active',
  };
}
