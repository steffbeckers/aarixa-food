'use strict';

var moment = require('moment');
var _ = require('lodash');

module.exports = function(Supplier) {
  // Validations
  Supplier.validatesUniquenessOf('name', {message: 'is already a supplier'});
  Supplier.validatesUniquenessOf('slug', {message: 'is already taken by another supplier'});

  // Find by slug
  Supplier.bySlug = function(slug, cb) {
    Supplier.findOne({where: {slug: slug}, include: 'menuItems'}, function(err, supplier) {
      if (err) { return cb(err); }
      cb(null, supplier);
    });
  };
  Supplier.remoteMethod(
    'bySlug',
    {
      http: {path: '/slug/:slug', verb: 'get'},
      accepts: {arg: 'slug', type: 'string'},
      returns: {type: 'object', root: true},
    }
  );

  // Today's orders per supplier
  // List orders, with filter functionality
  Supplier.todaysOrders = function(cb) {
    // Only show today's orders
    var today = moment();

    var filter = {
      include: {
        relation: 'orders',
        scope: {
          include: [
            {
              relation: 'orderItems',
              scope: {
                include: 'menuItem',
              },
            },
            {
              relation: 'userModel',
              scope: {
                fields: {
                  id: false,
                  username: true,
                },
              },
            },
          ],
          order: 'updatedOn DESC',
          where: {
            state: 'ready',
            updatedOn: {
              between: [
                new Date(today.format('YYYY-MM-DD')),
                new Date(today.add(1, 'day').format('YYYY-MM-DD')),
              ],
            },
          },
        },
      },
    };
    Supplier.find(filter, function(err, suppliers) {
      if (err) { return cb(err); }
      var suppliersWithOrders = [];

      // Filter only suppliers with orders
      _.each(suppliers, function(supplier) {
        var supplierJSON = supplier.toJSON();
        if (supplierJSON.orders.length > 0) {
          suppliersWithOrders.unshift(supplierJSON);
        }
      });

      // Return data
      cb(null, suppliersWithOrders);
    });
  };
  Supplier.remoteMethod('todaysOrders', {
    http: {
      path: '/todaysOrders',
      verb: 'get',
    },
    returns: {
      type: 'array',
      root: true,
    },
  });
};
