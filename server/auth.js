import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { config } from './config.js';

const SESSION_VERSION = 'v2';

function sign(payload) {
  return crypto.createHmac('sha256', config.sessionSecret).update(payload).digest('base64url');
}

function encodeSession(username, expiresAt) {
  const payload = Buffer.from(JSON.stringify({ v: SESSION_VERSION, username, expiresAt }), 'utf8').toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token) {
  if (!token) return null;
  const [payload, signature] = String(token).split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (session?.v !== SESSION_VERSION || typeof session.username !== 'string' || typeof session.expiresAt !== 'number') return null;
    if (session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function verifyMasterCredentials(username, password) {
  if (username !== config.masterUsername || !password) return false;
  return bcrypt.compare(password, config.masterPasswordHash);
}

export function createSession(username) {
  return encodeSession(username, Date.now() + config.sessionTtlMs);
}

export function getSession(token) {
  return decodeSession(token);
}

export function destroySession(_token) {
  // Stateless sessions cannot be revoked individually. Expiry is enforced by the signed token.
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
    sameSite: 'lax',
    path: '/',
    maxAge: config.sessionTtlMs,
  };
}
