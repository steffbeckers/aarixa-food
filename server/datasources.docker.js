'use strict';

module.exports = {
  mongodb: {
    connector: 'mongodb',
    name: 'mongodb',
    host: 'mongodb',
    port: 27017,
    user: 'aariXaFood',
    password: process.env.AARIXAFOOD_MONGODB_PASSWORD,
    database: 'aariXaFood',
  },
  email: {
    name: 'email',
    connector: 'mail',
    transports: [
      {
        type: 'smtp',
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        tls: {
          'rejectUnauthorized': true,
        },
        auth: {
          user: 'steff@steffbeckers.eu',
          pass: process.env.GMAIL_PASSWORD,
        },
      },
    ],
  },
};
