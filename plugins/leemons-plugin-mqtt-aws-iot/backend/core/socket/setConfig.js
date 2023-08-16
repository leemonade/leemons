const { tables } = require('../tables');
const { configChanged } = require('./aws');
const { getClientCached, clearClient } = require('./awsClient');

async function setConfig(data) {
  let newConfig = null;
  const config = await tables.config.findOne({});
  try {
    if (config) {
      newConfig = await tables.config.update({ id: config.id }, data);
    } else {
      newConfig = await tables.config.create(data);
    }
    configChanged();
    clearClient();
    await getClientCached();
    return newConfig;
  } catch (e) {
    configChanged();
    clearClient();
    if (config) {
      await tables.config.update({ id: config.id }, config);
      await getClientCached();
    } else {
      await tables.config.delete({ id: newConfig.id });
    }
    throw e;
  }
}

module.exports = { setConfig };
