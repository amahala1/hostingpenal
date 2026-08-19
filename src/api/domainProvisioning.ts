import { hostingApi } from './client';

export type DomainProvisionInput = {
  domain: string;
  username: string;
  phpVersion?: string;
  serverIp?: string;
  issueSsl?: boolean;
};

export type SubdomainProvisionInput = {
  prefix: string;
  parentDomain: string;
  username: string;
  phpVersion?: string;
  serverIp?: string;
  recordType?: 'A' | 'CNAME';
  target?: string;
  issueSsl?: boolean;
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

function phpSocket(version?: string): string {
  return PHP_SOCKET_BY_VERSION[version || '8.3'] || PHP_SOCKET_BY_VERSION['8.3'];
}

function validateUsername(value: string): string {
  const username = normalizeHostingUsername(value);
  if (!username || !/^[a-z][a-z0-9_-]{2,31}$/.test(username)) {
    throw new Error('A valid hosting username is required before provisioning a domain');
  }
  return username;
}

export async function provisionDomain(input: DomainProvisionInput) {
  const domain = input.domain.trim().toLowerCase();
  if (!domain) throw new Error('Domain name is required');
  const username = validateUsername(input.username);

  return hostingApi.provisionDomain({
    domain,
    username,
    phpSocket: phpSocket(input.phpVersion),
    serverIp: input.serverIp,
    issueSsl: input.issueSsl === true,
  });
}

export async function provisionSubdomain(input: SubdomainProvisionInput) {
  const prefix = input.prefix.trim().toLowerCase();
  const parentDomain = input.parentDomain.trim().toLowerCase();
  if (!prefix) throw new Error('Subdomain prefix is required');
  if (!parentDomain) throw new Error('Parent domain is required');
  const username = validateUsername(input.username);

  return hostingApi.provisionSubdomain({
    prefix,
    parentDomain,
    username,
    phpSocket: phpSocket(input.phpVersion),
    serverIp: input.serverIp,
    recordType: input.recordType,
    target: input.target,
    issueSsl: input.issueSsl === true,
  });
}
