const mixin = require('./mixin');
const authenticated = require('./authenticated');
const necessaryPermits = require('./necessary-permits');

module.exports = {
  LeemonsMiddlewaresMixin: mixin,
  LeemonsMiddlewareAuthenticated: authenticated,
  LeemonsMiddlewareNecessaryPermits: necessaryPermits,
};
