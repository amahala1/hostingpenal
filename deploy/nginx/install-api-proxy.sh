#!/usr/bin/env bash
set -euo pipefail

PANEL_HOST="${PANEL_HOST:-server1.sitindia.in}"
API_SNIPPET="${API_SNIPPET:-/root/hostingpenal/deploy/nginx/hostingpenal-api-proxy.conf}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/sites-available/${PANEL_HOST}}"

if [[ ! -f "$API_SNIPPET" ]]; then
  echo "API snippet not found: $API_SNIPPET" >&2
  exit 1
fi
if [[ ! -f "$NGINX_CONF" ]]; then
  echo "Nginx site config not found: $NGINX_CONF" >&2
  exit 1
fi

install -m 0644 "$API_SNIPPET" /etc/nginx/snippets/hostingpenal-api-proxy.conf

if ! grep -Fq 'include /etc/nginx/snippets/hostingpenal-api-proxy.conf;' "$NGINX_CONF"; then
  cp -a "$NGINX_CONF" "${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
  python3 - "$NGINX_CONF" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
include = '    include /etc/nginx/snippets/hostingpenal-api-proxy.conf;\n'

# Insert into the first server block, immediately after its opening brace.
marker = 'server {\n'
pos = text.find(marker)
if pos < 0:
    raise SystemExit('No server block found')
insert_at = pos + len(marker)
text = text[:insert_at] + include + text[insert_at:]
path.write_text(text)
PY
fi

nginx -t
systemctl reload nginx

echo "HostingPenal API proxy installed for ${PANEL_HOST}"
