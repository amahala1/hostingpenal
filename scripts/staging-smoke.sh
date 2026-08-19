#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:4000}"

status=$(curl -sS -o /tmp/hostingpenal-health.json -w '%{http_code}' "$BASE_URL/api/health")
test "$status" = "200"
grep -q '"success":true' /tmp/hostingpenal-health.json

echo "health: PASS"

status=$(curl -sS -o /tmp/hostingpenal-auth.json -w '%{http_code}' "$BASE_URL/api/auth/me")
test "$status" = "401"

grep -q 'Authentication required' /tmp/hostingpenal-auth.json

echo "auth boundary: PASS"

status=$(curl -sS -o /tmp/hostingpenal-provision.json -w '%{http_code}' \
  -H 'Content-Type: application/json' \
  -X POST "$BASE_URL/api/domains/provision" \
  -d '{"domain":"bad-domain","username":"testuser"}')
test "$status" = "401"
echo "provisioning auth boundary: PASS"

status=$(curl -sS -o /tmp/hostingpenal-dns.json -w '%{http_code}' \
  -H 'Content-Type: application/json' \
  -X POST "$BASE_URL/api/dns/zones" \
  -d '{"domain":"example.com","records":[]}' )
test "$status" = "401"
echo "DNS auth boundary: PASS"

echo "HostingPenal staging smoke: PASS"
