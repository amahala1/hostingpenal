const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof data === 'object' && data !== null && 'message' in data ? String(data.message) : `API request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

export interface DomainProvisionResult {
  success: boolean;
  domain: string;
  username: string;
  documentRoot: string;
  nginxPath?: string;
  enabled: boolean;
  dns?: { status: string; zoneFile?: string };
  ssl?: { status: string; message?: string };
}

export interface SubdomainProvisionResult extends DomainProvisionResult {
  parentDomain: string;
  dnsType: 'A' | 'CNAME';
  dnsTarget: string;
}

export const hostingApi = {
  health: () => request('/api/health'),
  login: (username: string, password: string) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  provisionDomain: (domain: string, username: string, phpSocket?: string, options: { serverIp?: string; issueSsl?: boolean } = {}) => request('/api/domains/provision', { method: 'POST', body: JSON.stringify({ domain, username, phpSocket, ...options }) }) as Promise<DomainProvisionResult>,
  provisionSubdomain: (subdomain: string, parentDomain: string, username: string, options: { phpSocket?: string; serverIp?: string; dnsType?: 'A' | 'CNAME'; dnsTarget?: string; issueSsl?: boolean } = {}) => request('/api/domains/subdomain/provision', { method: 'POST', body: JSON.stringify({ subdomain, parentDomain, username, ...options }) }) as Promise<SubdomainProvisionResult>,
  updateDnsZone: (domain: string, records: unknown[]) => request('/api/dns/zones', { method: 'POST', body: JSON.stringify({ domain, records }) }),
  getDnsZone: (domain: string) => request(`/api/dns/zones/${encodeURIComponent(domain)}`),
  resolveDns: (domain: string, type = 'A') => request(`/api/dns/resolve?domain=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`),
};
