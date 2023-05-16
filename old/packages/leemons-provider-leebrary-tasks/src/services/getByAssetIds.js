async function getByAssetIds(assetIds, { userSession, transacting }) {
  const { task: taskService } = leemons.getPlugin('tasks').services;

  // TODO: Implement this
  const tasks = await taskService.findByAssetIds(assetIds, { userSession, transacting });

  return tasks;
}

module.exports = { getByAssetIds };
