const { tables } = require('../tables');

async function getConfig() {
  return tables.config.findOne({});
}

module.exports = { getConfig };
