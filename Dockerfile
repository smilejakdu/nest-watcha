FROM node:16.13 AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "run", "start:dev"]