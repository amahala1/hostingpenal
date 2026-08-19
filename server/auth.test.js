import assert from 'node:assert/strict';
import test from 'node:test';

process.env.SESSION_SECRET = 'test-session-secret';
process.env.MASTER_USERNAME = 'superadmin';
process.env.MASTER_PASSWORD_HASH = 'unused-in-session-tests';
process.env.SESSION_TTL_MS = '10';

const { createSession, getSession, requireAuth } = await import('./auth.js');

test('creates and verifies a signed session', () => {
  const token = createSession('superadmin');
  const session = getSession(token);

  assert.equal(session?.username, 'superadmin');
  assert.equal(session?.v, 'v2');
  assert.equal(typeof session?.expiresAt, 'number');
});

test('rejects a tampered session', () => {
  const token = createSession('superadmin');
  const tamperedToken = `${token.slice(0, -1)}${token.endsWith('a') ? 'b' : 'a'}`;

  assert.equal(getSession(tamperedToken), null);
});

test('rejects an expired session', async () => {
  const token = createSession('superadmin');
  await new Promise((resolve) => setTimeout(resolve, 25));

  assert.equal(getSession(token), null);
});

test('returns 401 when authentication cookie is missing', () => {
  let statusCode;
  let responseBody;
  let nextCalled = false;
  const response = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    },
  };

  requireAuth({ cookies: {} }, response, () => {
    nextCalled = true;
  });

  assert.equal(statusCode, 401);
  assert.deepEqual(responseBody, { success: false, message: 'Authentication required' });
  assert.equal(nextCalled, false);
});
