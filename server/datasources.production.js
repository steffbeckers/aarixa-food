'use strict';

module.exports = {
  mongodb: {
    connector: 'mongodb',
    name: 'mongodb',
    host: 'localhost',
    port: 27017,
    user: 'snooker',
    password: process.env.MONGODB_PASSWORD,
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
          user: process.env.GMAIL_EMAIL || 'steff@steffbeckers.eu',
          pass: process.env.GMAIL_PASSWORD,
        },
      },
    ],
  },
};
