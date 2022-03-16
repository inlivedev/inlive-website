#!/usr/bin/env sh
set -eu
NGINX_PORT=${PORT:-8080}
sed -i "s/\${NGINX_PORT}/${NGINX_PORT}/g" /etc/nginx/conf.d/*.conf
echo "nginx: testing config"
nginx -t
echo "nginx: starting on $NGINX_PORT"
exec "$@"
