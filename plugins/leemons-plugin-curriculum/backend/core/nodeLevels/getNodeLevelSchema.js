async function getNodeLevelSchema(nodeLevelId, locale, { transacting }) {
  try {
    if (locale) {
      return await leemons
        .getPlugin('dataset')
        .services.dataset.getSchemaWithLocale(
          `node-level-${nodeLevelId}`,
          'plugins.curriculum',
          locale,
          {
            transacting,
            useDefaultLocaleCallback: false,
          }
        );
    }
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
