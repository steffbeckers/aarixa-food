'use strict';

module.exports = function(Order) {
  // Set owner before creating the order
  Order.observe('before save', function setAutoData(context, next) {
    if (context.instance) {
      if (context.isNewInstance) {
        context.instance.ownerId = context.options.accessToken.userId;
      }
    }
    next();
  });

  // After save
  Order.observe('after save', function afterSave(ctx, next) {
    // Cascade unlink on soft delete
    // If deletedOn is set, unlink MenuItems
    if (ctx.data && ctx.data.deletedOn !== null) {
      var OrderItem = Order.app.models.OrderItem;
      // OrderItem.destroyAll(
      //   {
      //     matchId: ctx.where.and[0].id,
      //   },
      //   function(err, result) {}
      // );
    }

    next();
  });

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
      include: ['userModel', 'menuItems'],
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
