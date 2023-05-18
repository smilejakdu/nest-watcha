FROM 955251329813.dkr.ecr.ap-northeast-2.amazonaws.com/nest_watcha/node:16.15.1-alpine3.14 as node

# 필요한 패키지를 설치합니다.
RUN apk add --no-cache make g++ && \
    apk add --update --no-cache python3 && \
    ln -sf python3 /usr/bin/python \

FROM node AS install
WORKDIR /app
COPY package.json .
RUN npm install

FROM node
WORKDIR /usr/src/app
COPY --from=install /app .
COPY . .
ENTRYPOINT npm run start:dev
