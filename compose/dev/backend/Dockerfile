#FROM 389315113065.dkr.ecr.ap-northeast-2.amazonaws.com/fym/node:16.15.1-alpine3.14 as node
FROM node:16.13.0 as node

FROM node AS install
WORKDIR /app
COPY package.json .
RUN npm install

FROM node
WORKDIR /usr/src/app
COPY --from=install /app .
COPY . .
ENTRYPOINT npm run start:dev