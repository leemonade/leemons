const createUserPool = require('./createUserPool');
const identityProviders = require('./identityProviders');
const client = require('./client');

module.exports = {
  createUserPool,

  ...identityProviders,
  ...client,
};
