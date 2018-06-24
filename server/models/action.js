'use strict';

module.exports = function(Action) {
  // Set owner before creating the order
  Action.observe('before save', function setAutoData(context, next) {
    if (context.instance && context.options && context.options.accessToken) {
      if (context.isNewInstance) {
        context.instance.userModelId = context.options.accessToken.userId;
      }
    }
    next();
  });
};
