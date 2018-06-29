FROM node:8

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD export NODE_ENV='production'

CMD node server/server.js

EXPOSE 3333
