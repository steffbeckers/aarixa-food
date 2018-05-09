'use strict';

module.exports = function(UserModel) {
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
      ctx.result = resultJSON;

      next();
    });
  });
};
