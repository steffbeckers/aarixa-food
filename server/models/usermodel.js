'use strict';

var app = require('../../server/server');
var path = require('path');
var qs = require('querystring');
var senderAddress = 'steff@steffbeckers.eu';

module.exports = function(UserModel) {
  // Include roles, remove fields on login
  UserModel.afterRemote('login', function(ctx, userInstance, next) {
    console.log('> UserModel.afterRemote.login');

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

      // Create base64 string of auth credentials
      var credentialsAsBase64 = Buffer.from(
        JSON.stringify(resultJSON)
      ).toString('base64');
      console.log(credentialsAsBase64);

      var htmlEmail = '<h1>aariXaFood</h1><p><a href="';
      htmlEmail += app.get('loginHrefApp') + '?credentials=' + credentialsAsBase64;
      htmlEmail += '">Doorgaan met inloggen</a></p>';

      // Send email to user with credentials in link
      UserModel.app.models.Email.send({
        to: userJSON.email,
        from: senderAddress,
        subject: 'aariXaFood - Login',
        html: htmlEmail,
      }, function(err) {
        if (err) {
          console.log('> Error sending password reset email');
          ctx.result = {code: 'ERROR_SENDING_AUTH_EMAIL'};
          next();
        } else {
          console.log('> Auth email sent to:', userJSON.email);
          // Set ctx result to email sent
          ctx.result = {code: 'AUTH_EMAIL_SENT'};
          next();
        }
      });
    });
  });
};
