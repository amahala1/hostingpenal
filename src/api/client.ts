const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(data?.message || `API request failed (${response.status})`);
  return data;
}

export const hostingApi = {
  health: () => request('/api/health'),
  login: (username, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
  updateDnsZone: (domain, records) => request('/api/dns/zones', { method: 'POST', body: JSON.stringify({ domain, records }) }),
  getDnsZone: (domain) => request(`/api/dns/zones/${encodeURIComponent(domain)}`),
  resolveDns: (domain, type = 'A') => request(`/api/dns/resolve?domain=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`),
};
