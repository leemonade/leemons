const config = require('../src/services/config');

module.exports = {
  getConfig: config.getConfig,
  getUserAgentsWithKeyValue: config.getUserAgentsWithKeyValue,
  getValuesForUserAgentsAndKey: config.getValuesForUserAgentsAndKey,
};
