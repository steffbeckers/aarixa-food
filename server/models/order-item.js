'use strict';

module.exports = function(OrderItem) {
  // Set owner before creating the order
  OrderItem.observe('before save', function setAutoData(context, next) {
    if (context.instance && context.options && context.options.accessToken) {
      if (context.isNewInstance) {
        context.instance.userModelId = context.options.accessToken.userId;
      }
    }
    next();
  });
};
