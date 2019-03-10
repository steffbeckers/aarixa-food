FROM node:alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD NODE_ENV=production node server/server.js

EXPOSE 3000
