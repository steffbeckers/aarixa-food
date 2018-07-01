'use strict';

module.exports = {
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
