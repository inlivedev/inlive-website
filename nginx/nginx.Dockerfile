FROM nginx:1.16-alpine@sha256:270bea203d2fc3743fb9ce0193325e188b7e6233043487e3d3cf117ea4d3f337 as nginx
WORKDIR /
COPY . .
ARG SITE=inlive-website
# Config
COPY nginx/etc/nginx /etc/nginx
# Sources
RUN mkdir -p /var/www/
COPY ./public /var/www/public
# initialization
COPY nginx/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
