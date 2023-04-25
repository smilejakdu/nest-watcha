FROM nginx:1.19.2-alpine

RUN rm /etc/nginx/conf.d/default.conf || true
COPY compose/dev/nginx/nginx.conf /etc/nginx
COPY compose/dev/nginx/nest_watcha.conf /etc/nginx/conf.d

RUN ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
