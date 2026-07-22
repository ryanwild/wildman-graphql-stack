FROM caddy:2.11.2-alpine

COPY ./ingress/config/Caddyfile /etc/caddy/Caddyfile
COPY ./userui/public /srv/public

HEALTHCHECK --interval=30s --timeout=30s --start-period=90s --retries=3 \
  CMD curl -LsSfk http://127.0.0.1/health || exit 1

EXPOSE 80 443

