#!/usr/bin/env bash
set -euo pipefail

required_major=20
major="$(node -p "process.versions.node.split('.')[0]")"
if (( major < required_major )); then
  echo "ERROR: Node.js ${required_major}+ is required; found $(node -v)" >&2
  exit 1
fi

test -S /run/php/php8.3-fpm.sock
command -v nginx >/dev/null
command -v named-checkconf >/dev/null
command -v named-checkzone >/dev/null
command -v rndc >/dev/null
systemctl is-active --quiet php8.3-fpm
systemctl is-active --quiet named
nginx -t
named-checkconf

echo "Predeploy environment: PASS"
