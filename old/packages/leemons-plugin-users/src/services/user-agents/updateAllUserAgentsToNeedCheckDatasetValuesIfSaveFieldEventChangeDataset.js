const { table } = require('../tables');

async function updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset({
  locationName,
  pluginName,
  transacting,
}) {
  if (locationName === 'user-data' && pluginName === 'plugins.users') {
    await table.userAgent.updateMany(
      { id_$null: false },
      { datasetIsGood: false },
      { transacting }
    );
  }
}

module.exports = { updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset };
