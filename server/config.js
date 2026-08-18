import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const config = {
  port: Number(process.env.API_PORT || 4000),
  host: process.env.API_HOST || '127.0.0.1',
  nodeEnv: process.env.NODE_ENV || 'production',
  cookieName: process.env.SESSION_COOKIE_NAME || 'hostadmin_session',
  sessionTtlMs: Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 8),
  masterUsername: required('MASTER_USERNAME'),
  masterPasswordHash: required('MASTER_PASSWORD_HASH'),
  bindZoneDir: process.env.BIND_ZONE_DIR || '/etc/bind/zones',
  bindReloadCommand: process.env.BIND_RELOAD_COMMAND || 'rndc reload',
};
