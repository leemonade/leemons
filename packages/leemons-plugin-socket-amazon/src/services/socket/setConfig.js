const { tables } = require('../tables');
const { configChanged } = require('./aws');

async function setConfig(data) {
  configChanged();
  const config = await tables.config.findOne({});
  if (config) return tables.config.update({ id: config.id }, data);
  return tables.config.create(data);
}

module.exports = { setConfig };
