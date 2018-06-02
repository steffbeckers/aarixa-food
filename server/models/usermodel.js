'use strict';

var app = require('../../server/server');
var path = require('path');
var qs = require('querystring');
var senderAddress = 'steff@steffbeckers.eu';

var moment = require('moment');

module.exports = function(UserModel) {
  // Remove username uniqueness
  delete UserModel.validations.username;

  // After save
  UserModel.observe('after save', function afterSave(ctx, next) {
    // Cascade unlink on soft delete
    // If deletedOn is set, delete Orders
    if (ctx.data && ctx.data.deletedOn !== null) {
      var Order = UserModel.app.models.Order;
      Order.destroyAll(
        {
          userModelId: ctx.where.and[0].id,
        },
        function(err, result) {}
      );
    }

    next();
  });

  // Create logic
  UserModel.beforeRemote('create', function(ctx, userInstance, next) {
    // Lower case email address
    ctx.req.body.email = ctx.req.body.email.toLowerCase();
    // aarixa to aariXa
    ctx.req.body.email = ctx.req.body.email.replace('aarixa', 'aariXa');

    // Set password same as email address
    ctx.req.body.password = ctx.req.body.email;

    // Grep username from email address
    var beforeAtSign = ctx.req.body.email.substr(0, ctx.req.body.email.indexOf('@'));
    var indexOfDot = beforeAtSign.indexOf('.');
    if (indexOfDot === -1) {
      // AD username
      ctx.req.body.username = beforeAtSign;
    } else {
      // First name
      ctx.req.body.username = beforeAtSign.substr(0, indexOfDot);
      // Capitalize first letter
      ctx.req.body.username = ctx.req.body.username.charAt(0).toUpperCase() + ctx.req.body.username.slice(1);
    }

    next();
  });

  // Login logic
  UserModel.beforeRemote('login', function(ctx, userInstance, next) {
    // Lower case email address
    ctx.req.body.email = ctx.req.body.email.toLowerCase();
    // aarixa to aariXa
    ctx.req.body.email = ctx.req.body.email.replace('aarixa', 'aariXa');

    // Set password same as email address
    ctx.req.body.password = ctx.req.body.email;

    next();
  });

  // Include roles, remove fields on login
  UserModel.afterRemote('login', function(ctx, userInstance, next) {
    var resultJSON = ctx.result.toJSON();

    // Overwrite user with roles
    var filter = {
      fields: {
        createdOn: false,
        updatedOn: false,
      },
      include: 'roles',
    };
    UserModel.findById(ctx.result.userId, filter, function(err, user) {
      var userJSON = user.toJSON();
      // Simplify roles in string array
      var simpleRoleArray = [];
      userJSON.roles.forEach(role => {
        simpleRoleArray.push(role.name);
      });
      userJSON.roles = simpleRoleArray;

      // Replace user
      resultJSON.user = userJSON;

      // Set username
      resultJSON.username = userJSON.username;

      // Create base64 string of auth credentials
      var credentialsAsBase64 = Buffer.from(
        JSON.stringify(resultJSON)
      ).toString('base64');

      var htmlEmail = '<a href="';
      htmlEmail += app.get('loginHrefApp') + '?credentials=' + credentialsAsBase64;
      htmlEmail += '">Doorgaan met inloggen</a>';

      // Don't send emails during local dev
      if (process.env.NODE_ENV === 'local') {
        resultJSON.credentials = credentialsAsBase64;
        ctx.result = resultJSON;
        next();
        return;
      }

      // Send email to user with credentials in link
      UserModel.app.models.Email.send({
        to: userJSON.email,
        from: senderAddress,
        subject: 'aariXaFood',
        html: htmlEmail,
      }, function(err) {
        if (err) {
          ctx.result = {code: 'ERROR_SENDING_AUTH_EMAIL'};
          next();
        } else {
          // Set ctx result to email sent
          ctx.result = {code: 'AUTH_EMAIL_SENT'};
          next();
        }
      });
    });
  });

  // Create or get current order for Supplier
  UserModel.getOrCreateOrderForSupplier = function(id, slug, cb) {
    var Supplier = UserModel.app.models.Supplier;
    var Order = UserModel.app.models.Order;

    Supplier.bySlug(slug, function(err, supplier) {
      if (err) { return cb(err); }

      var filter = {
        where: {
          userModelId: id,
          supplierId: supplier.id,
          state: 'draft',
        },
        include: {
          relation: 'orderItems',
          scope: {
            include: 'menuItem',
          },
        },
      };
      Order.findOne(filter, function(err, order) {
        if (err) { return cb(err); }
        if (order) {
          // Update time on order
          order.updatedOn = moment().toISOString();
          // Return draft order
          cb(null, order);
        } else {
          var newOrder = {
            userModelId: id,
            supplierId: supplier.id,
            state: 'draft',
          };
          Order.create(newOrder, function(err, order) {
            if (err) { return cb(err); }
            // Convert to JSON
            order = order.toJSON();
            // Set empty orderItems array
            order.orderItems = [];
            // Return new order
            cb(null, order);
          });
        }
      });
    });
  };
  UserModel.remoteMethod(
    'getOrCreateOrderForSupplier',
    {
      http: {path: '/:id/getOrCreateOrderForSupplier/:slug', verb: 'get'},
      accepts: [
        {arg: 'id', type: 'string'},
        {arg: 'slug', type: 'string'},
      ],
      returns: {type: 'object', root: true},
    }
  );
};
