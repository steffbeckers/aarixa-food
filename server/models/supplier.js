'use strict';

module.exports = function(Supplier) {
  // Validations
  Supplier.validatesUniquenessOf('name', {message: 'is already a supplier'});
  Supplier.validatesUniquenessOf('slug', {message: 'is already taken by another supplier'});
};
