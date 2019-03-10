'use strict';

module.exports = function(app) {
  // Realtime Order updates
  var Order = app.models.Order;
  Order.createChangeStream();

  // Realtime Action updates
  var Action = app.models.Order;
  Action.createChangeStream();
};
