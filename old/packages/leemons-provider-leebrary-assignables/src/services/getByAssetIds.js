module.exports = async function getByAssetIds(assetIds, { userSession, transacting }) {
  const { assignables } = leemons.getPlugin('assignables').services;

  // TODO: Implement this
  const tasks = await assignables.findAssignableByAssetIds(assetIds, { userSession, transacting });

  return tasks;
};
