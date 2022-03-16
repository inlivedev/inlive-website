FROM nginx:latest
COPY site.conf /etc/nginx
RUN mkdir -p /var/www/inlive-website
COPY site.conf /etc/nginx/conf.d/
COPY ./public /var/www/inlive-website
COPY ./docker.sh /
ENTRYPOINT ["bash", "/docker.sh"]
CMD ["nginx", "-g", "daemon off;"]
