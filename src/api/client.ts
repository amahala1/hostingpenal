import type { AuthResponse } from './authTypes';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('hostadmin:auth-expired'));
    }
    const message = typeof data === 'object' && data !== null && 'message' in data ? String(data.message) : `API request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export interface DomainProvisionResult {
  success: boolean;
  message?: string;
  domain: string;
  username: string;
  documentRoot: string;
  nginxPath?: string;
  enabled: boolean;
  nginx?: { status: string; path?: string };
  dns?: { status: string; zoneFile?: string };
  ssl?: { status: string; message?: string };
}

export interface SubdomainProvisionResult extends DomainProvisionResult {
  parentDomain: string;
  dnsType: 'A' | 'CNAME';
  dnsTarget: string;
}

export interface DnsZoneUpdateResult {
  success: boolean;
  serial?: string | number;
  message?: string;
}

export interface DnsResolveResult {
  success: boolean;
  answers?: string[];
  message?: string;
}

export const hostingApi = {
  health: () => request('/api/health'),
  login: (username: string, password: string) => request<AuthResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request<AuthResponse>('/api/auth/logout', { method: 'POST' }),
  me: () => request<AuthResponse>('/api/auth/me'),
  provisionDomain: (input: { domain: string; username: string; phpSocket?: string; serverIp?: string; issueSsl?: boolean }) =>
    request('/api/domains/provision', { method: 'POST', body: JSON.stringify(input) }) as Promise<DomainProvisionResult>,
  provisionSubdomain: (input: { prefix: string; parentDomain: string; username: string; phpSocket?: string; serverIp?: string; recordType?: 'A' | 'CNAME'; target?: string; issueSsl?: boolean }) =>
    request('/api/domains/subdomain/provision', {
      method: 'POST',
      body: JSON.stringify({
        subdomain: input.prefix,
        parentDomain: input.parentDomain,
        username: input.username,
        phpSocket: input.phpSocket,
        serverIp: input.serverIp,
        dnsType: input.recordType,
        dnsTarget: input.target,
        issueSsl: input.issueSsl,
      }),
    }) as Promise<SubdomainProvisionResult>,
  updateDnsZone: (domain: string, records: unknown[]) => request<DnsZoneUpdateResult>('/api/dns/zones', { method: 'POST', body: JSON.stringify({ domain, records }) }),
  getDnsZone: (domain: string) => request<string>(`/api/dns/zones/${encodeURIComponent(domain)}`),
  resolveDns: (domain: string, type = 'A') => request<DnsResolveResult>(`/api/dns/resolve?domain=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`),
};
