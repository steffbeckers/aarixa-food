'use strict';

module.exports = function(Order) {
  // List orders, with filter functionality
  Order.list = function(dateTime, orderBy, orderDirection, skip, take, cb) {
    // Check on input
    if (orderBy !== 'updatedOn') {
      orderBy = 'updatedOn';
    }
    if (orderDirection !== 'ASC' && orderDirection !== 'DESC') {
      orderDirection = 'ASC';
    }
    if (skip === undefined) { skip = 0; }
    if (take === undefined) { take = 20; }

    var filter = {
      order: orderBy + ' ' + orderDirection,
      skip: skip,
      limit: take,
    };

    Order.find(filter, function(err, orders) {
      cb(null, orders);
    });
  };
  Order.remoteMethod('list',
    {
      http: {
        path: '/list',
        verb: 'get',
      },
      accepts: [
        {
          arg: 'dateTime',
          type: 'string',
          http: {
            source: 'query',
          },
        },
        {
          arg: 'orderBy',
          type: 'string',
          http: {
            source: 'query',
          },
        },
        {
          arg: 'orderDirection',
          type: 'string',
          http: {
            source: 'query',
          },
        },
        {
          arg: 'skip',
          type: 'number',
          http: {
            source: 'query',
          },
        },
        {
          arg: 'take',
          type: 'number',
          http: {
            source: 'query',
          },
        },
      ],
      returns: {
        type: 'array',
        root: true,
      },
    }
  );
};
