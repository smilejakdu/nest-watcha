#!/bin/bash

# Backend 주소와 포트
BACKEND_HOST=watcha_backend
BACKEND_PORT=13014

# 데이터베이스 주소와 포트
DB_HOST=db
DB_PORT=3306

# 데이터베이스가 준비될 때까지 대기
echo "Waiting for the database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
    sleep 1
done

# Backend가 준비될 때까지 대기
echo "Waiting for the backend to be ready..."
while ! nc -z $BACKEND_HOST $BACKEND_PORT; do
    sleep 1
done

# Backend와 데이터베이스가 준비되면 Nginx 시작
echo "Backend and database are ready. Starting Nginx..."
nginx -g 'daemon off;'
