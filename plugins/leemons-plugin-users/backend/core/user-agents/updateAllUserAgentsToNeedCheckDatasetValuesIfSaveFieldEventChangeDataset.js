async function updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset({
  locationName,
  pluginName,
  ctx,
}) {
  if (locationName === 'user-data' && pluginName === 'users') {
    await ctx.tx.db.UserAgent.updateMany({ id: { $ne: null } }, { datasetIsGood: false });
  }
}

module.exports = { updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset };
