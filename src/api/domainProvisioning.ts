import { hostingApi } from './client';

export type DomainProvisionInput = {
  domain: string;
  username: string;
  phpVersion?: string;
};

const PHP_SOCKET_BY_VERSION: Record<string, string> = {
  '8.4': '/run/php/php8.4-fpm.sock',
  '8.3': '/run/php/php8.3-fpm.sock',
  '8.2': '/run/php/php8.2-fpm.sock',
  '8.1': '/run/php/php8.1-fpm.sock',
};

export function normalizeHostingUsername(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 32);
}

export async function provisionDomain(input: DomainProvisionInput) {
  const domain = input.domain.trim().toLowerCase();
  const username = normalizeHostingUsername(input.username);
  if (!domain) throw new Error('Domain name is required');
  if (!username || !/^[a-z][a-z0-9_-]{2,31}$/.test(username)) {
    throw new Error('A valid hosting username is required before provisioning a domain');
  }

  const phpSocket = PHP_SOCKET_BY_VERSION[input.phpVersion || '8.3'] || PHP_SOCKET_BY_VERSION['8.3'];
  return hostingApi.provisionDomain(domain, username, phpSocket);
}
