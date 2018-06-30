FROM node:8

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

CMD NODE_ENV=production AARIXAFOOD_MONGODB_USER=aariXaFood AARIXAFOOD_MONGODB_PASSWORD=thisGetsUpdated GMAIL_EMAIL=steff@steffbeckers.eu GMAIL_PASSWORD=thisGetsUpdated node server/server.js

EXPOSE 3333
