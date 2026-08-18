import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

const sessions = new Map();

export async function verifyMasterCredentials(username, password) {
  if (username !== config.masterUsername || !password) return false;
  return bcrypt.compare(password, config.masterPasswordHash);
}

export function createSession(username) {
  const token = crypto.randomBytes(32).toString('base64url');
  sessions.set(token, { username, expiresAt: Date.now() + config.sessionTtlMs });
  return token;
}

export function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  session.expiresAt = Date.now() + config.sessionTtlMs;
  return session;
}

export function destroySession(token) {
  if (token) sessions.delete(token);
}

export function requireAuth(req, res, next) {
  const session = getSession(req.cookies?.[config.cookieName]);
  if (!session) return res.status(401).json({ success: false, message: 'Authentication required' });
  req.user = session;
  next();
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: config.sessionTtlMs,
  };
}
