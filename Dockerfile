FROM node:8

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD NODE_ENV=production AARIXAFOOD_MONGODB_USER node server/server.js

EXPOSE 3333
