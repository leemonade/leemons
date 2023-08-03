/* eslint-disable global-require */
module.exports = {
  ...require('./getPluginProvider'),
  ...require('./getPluginProviders'),
  ...require('./getProvidersActions'),
};
