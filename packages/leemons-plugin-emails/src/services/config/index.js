const { getConfig } = require('./getConfig');
const { saveConfig } = require('./saveConfig');
const { getUserAgentsWithKeyValue } = require('./getUserAgentsWithKeyValue');
const { getValuesForUserAgentsAndKey } = require('./getValuesForUserAgentsAndKey');

module.exports = {
  getConfig,
  saveConfig,
  getUserAgentsWithKeyValue,
  getValuesForUserAgentsAndKey,
};
