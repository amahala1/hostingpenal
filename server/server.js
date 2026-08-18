import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { config } from './config.js';
import { cookieOptions, createSession, destroySession, requireAuth, verifyMasterCredentials } from './auth.js';
import { readZone, writeZone } from './dns.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'hostingpenal-api', time: new Date().toISOString() }));

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    const valid = await verifyMasterCredentials(String(username || ''), String(password || ''));
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid username or password' });
    const token = createSession(config.masterUsername);
    res.cookie(config.cookieName, token, cookieOptions());
    return res.json({ success: true, user: { username: config.masterUsername, role: 'Super Administrator' } });
  } catch (error) {
    console.error('login error', error);
    return res.status(500).json({ success: false, message: 'Authentication service unavailable' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  destroySession(req.cookies?.[config.cookieName]);
  res.clearCookie(config.cookieName, { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: 'strict', path: '/' });
  res.json({ success: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => res.json({ success: true, user: { username: req.user.username, role: 'Super Administrator' } }));

app.post('/api/dns/zones', requireAuth, async (req, res) => {
  try {
    const { domain, records = [] } = req.body ?? {};
    const result = await writeZone(String(domain || '').toLowerCase(), records);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('dns write error', error);
    res.status(400).json({ success: false, message: error?.message || 'DNS zone update failed' });
  }
});

app.get('/api/dns/zones/:domain', requireAuth, async (req, res) => {
  try {
    const zone = await readZone(req.params.domain.toLowerCase());
    res.type('text/plain').send(zone);
  } catch (error) {
    res.status(404).json({ success: false, message: error?.message || 'Zone not found' });
  }
});

app.get('/api/dns/resolve', requireAuth, async (req, res) => {
  const domain = String(req.query.domain || '').toLowerCase();
  const type = String(req.query.type || 'A').toUpperCase();
  if (!domain || !/^(A|AAAA|CNAME|MX|TXT|NS|CAA|SRV)$/.test(type)) {
    return res.status(400).json({ success: false, message: 'Invalid domain or record type' });
  }
  try {
    const { execFile } = await import('node:child_process');
    const { promisify } = await import('node:util');
    const exec = promisify(execFile);
    const { stdout } = await exec('dig', ['+short', domain, type], { timeout: 5000 });
    res.json({ success: true, domain, type, answers: stdout.trim() ? stdout.trim().split('\n') : [] });
  } catch (error) {
    res.status(502).json({ success: false, message: 'DNS resolver query failed' });
  }
});

app.use((err, _req, res, _next) => {
  console.error('unhandled API error', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(config.port, config.host, () => {
  console.log(`HostAdmin API listening on http://${config.host}:${config.port}`);
});
