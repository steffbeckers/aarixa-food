'use strict';

module.exports = function(Supplier) {
  // Validations
  Supplier.validatesUniquenessOf('name', {message: 'is already a supplier'});
  Supplier.validatesUniquenessOf('slug', {message: 'is already taken by another supplier'});

  // Find by slug
  Supplier.bySlug = function(slug, cb) {
    Supplier.findOne({where: {slug: slug}, include: 'menuItems'}, function(err, supplier) {
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
};
