async function getNodeLevelSchema(nodeLevelId, { transacting }) {
  try {
    return await leemons
      .getPlugin('dataset')
      .services.dataset.getSchema(`node-level-${nodeLevelId}`, 'plugins.curriculum', {
        transacting,
      });
  } catch (err) {
    return null;
  }
}

module.exports = { getNodeLevelSchema };
