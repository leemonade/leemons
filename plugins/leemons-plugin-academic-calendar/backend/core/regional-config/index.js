const { deleteRegionalConfig } = require('./deleteRegionalConfig');
const { listRegionalConfigs } = require('./listRegionalConfigs');
const { saveRegionalConfig } = require('./saveRegionalConfig');

module.exports = {
  listRegionalConfigs,
  saveRegionalConfig,
  deleteRegionalConfig,
};
