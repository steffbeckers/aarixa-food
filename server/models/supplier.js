'use strict';

module.exports = function(Supplier) {
  // Validations
  Supplier.validatesUniquenessOf('name', {message: 'is already a supplier'});
};
