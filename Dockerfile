FROM node:8

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD NODE_ENV=docker node server/server.js

EXPOSE 3333
