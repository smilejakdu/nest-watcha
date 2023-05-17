FROM 955251329813.dkr.ecr.ap-northeast-2.amazonaws.com/nest_watcha/dev/nginx:latest

RUN rm /etc/nginx/conf.d/default.conf || true
COPY compose/dev/nginx/nginx.conf /etc/nginx
COPY compose/dev/nginx/nest_watcha.conf /etc/nginx/conf.d
