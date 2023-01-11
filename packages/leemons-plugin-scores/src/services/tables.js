const { pluginName } = require('../../config/constants');

const pluginNameForTables = pluginName.replace(/\./g, '_');

module.exports = {
  periods: leemons.query(`${pluginNameForTables}::periods`),
  scores: leemons.query(`${pluginNameForTables}::scores`),
};
