'use strict';

var _ = require('lodash');
var moment = require('moment');

module.exports = function(Order) {
  // Set owner before creating the order
  Order.observe('before save', function setAutoData(context, next) {
    if (context.instance && context.options && context.options.accessToken) {
      if (context.isNewInstance) {
        context.instance.userModelId = context.options.accessToken.userId;
      }
    }
    next();
  });

  // After save
  Order.observe('after save', function afterSave(ctx, next) {
    var OrderItem = Order.app.models.OrderItem;
    var MenuItem = Order.app.models.MenuItem;

    // Cascade unlink on soft delete
    // If deletedOn is set, unlink MenuItems (delete orderItems)
    if (ctx.data && ctx.data.deletedOn !== null) {
      // Remove the timesOrdered value on MenuItems
      OrderItem.find({where: {orderId: ctx.where.and[0].id}}, function(err, orderItems) {
        orderItems.forEach(orderItem => {
          // If menu item attached
          if (orderItem.menuItem) {
            orderItem.menuItem.get().then(function(menuItem) {
              if (menuItem.timesOrdered) {
                var times = menuItem.timesOrdered - orderItem.quantity;
                if (times < 0) times = 0;
                menuItem.updateAttribute('timesOrdered', times, function(err, updatedMenuItem) {});
              }
            });
          }
        });
        OrderItem.destroyAll(
          {
            orderId: ctx.where.and[0].id,
          },
          function(err, result) {}
        );
      });
    }

    // If the Order updates to state ready, add timesOrdered on MenuItem
    if (ctx.instance && ctx.instance.state === 'ready') {
      OrderItem.find({where: {orderId: ctx.instance.id}}, function(err, orderItems) {
        orderItems.forEach(orderItem => {
          // If menu item attached
          if (orderItem.menuItem) {
            orderItem.menuItem.get().then(function(menuItem) {
              if (menuItem.timesOrdered === undefined) {
                menuItem.updateAttribute('timesOrdered', orderItem.quantity, function(err, updatedMenuItem) {});
              } else {
                menuItem.updateAttribute('timesOrdered', menuItem.timesOrdered + orderItem.quantity, function(err, updatedMenuItem) {});
              }
            });
          }
        });
      });
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
  Order.remoteMethod('list', {
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
  });

  // List orders, with filter functionality
  Order.listPerSupplierOnHomepage = function(cb) {
    // Only show today's orders
    var today = moment();

    var filter = {
      include: [
        {
          relation: 'userModel',
          scope: {
            fields: {
              id: false,
              username: true,
            },
          },
        },
        {
          relation: 'supplier',
          scope: {
            fields: {
              id: true,
              name: true,
              telephone: true,
              website: true,
            },
          },
        },
        {
          relation: 'orderItems',
          scope: {
            include: 'menuItem',
          },
        },
      ],
      order: 'updatedOn DESC',
      where: {
        updatedOn: {
          between: [
            new Date(today.format('YYYY-MM-DD')),
            new Date(today.add(1, 'day').format('YYYY-MM-DD')),
          ],
        },
      },
    };
    Order.find(filter, function(err, orders) {
      // Group by supplier
      var ordersGroupedBySupplier = _.groupBy(orders, 'supplierId');
      cb(null, ordersGroupedBySupplier);
    });
  };
  Order.remoteMethod('listPerSupplierOnHomepage', {
    http: {
      path: '/listPerSupplierOnHomepage',
      verb: 'get',
    },
    returns: {
      type: 'array',
      root: true,
    },
  });
};
