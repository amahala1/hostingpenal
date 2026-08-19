import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MASTER_USERNAME ||= 'superadmin';
process.env.MASTER_PASSWORD_HASH ||= 'test-hash';
process.env.SESSION_SECRET ||= 'hostingpenal-test-session-secret';

const { getDocumentRoot, renderNginxServerBlock } = await import('./provisioning.js');

test('rejects invalid domain names', () => {
  assert.throws(() => getDocumentRoot('sitindia', 'not-a-domain'), /Invalid domain name/);
});

test('rejects invalid hosting usernames', () => {
  assert.throws(() => getDocumentRoot('1invalid', 'example.com'), /Invalid hosting username/);
});

test('keeps document roots inside the hosting home', () => {
  const root = getDocumentRoot('sitindia', 'example.com');
  assert.equal(root, '/home/sitindia/public_html/example.com');
  assert.ok(root.startsWith('/home/sitindia/public_html/'));
});

test('renders an isolated nginx server block', () => {
  const config = renderNginxServerBlock({
    domain: 'example.com',
    username: 'sitindia',
    phpSocket: '/run/php/php8.3-fpm.sock',
  });

  assert.match(config, /server_name example\.com www\.example\.com;/);
  assert.match(config, /root \/home\/sitindia\/public_html\/example\.com;/);
  assert.match(config, /fastcgi_pass unix:\/run\/php\/php8\.3-fpm\.sock;/);
  assert.doesNotMatch(config, /sitindia.*example\.com.*\.\./);
});
