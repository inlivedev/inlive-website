FROM nginx:latest
COPY site.conf /etc/nginx
RUN mkdir -p /var/www/
COPY ./public /var/www/public
COPY nginx/docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
