import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

test('DNS module rejects malformed records before writing a zone', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hostingpenal-dns-'));
  process.env.BIND_ZONE_DIR = tempDir;
  process.env.MASTER_USERNAME ||= 'superadmin';
  process.env.MASTER_PASSWORD_HASH ||= 'test-hash';
  process.env.SESSION_SECRET ||= 'hostingpenal-test-session-secret';

  const { writeZone } = await import('./dns.js');
  const zonePath = path.join(tempDir, 'db.example.com');

  await assert.rejects(
    writeZone('example.com', [{ name: '@', type: 'A', value: 'not-an-ip', ttl: 300 }]),
    /Invalid IPv4 address/
  );

  await assert.rejects(fs.access(zonePath));
  await fs.rm(tempDir, { recursive: true, force: true });
});

test('DNS zone writer only accepts bounded TTL values', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'hostingpenal-dns-'));
  process.env.BIND_ZONE_DIR = tempDir;
  const { writeZone } = await import('./dns.js');

  await assert.rejects(
    writeZone('example.com', [{ name: '@', type: 'A', value: '192.0.2.1', ttl: 1 }]),
    /TTL must be between 60 and 86400/
  );

  await fs.rm(tempDir, { recursive: true, force: true });
});
