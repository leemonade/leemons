async function getNodeLevelSchema({ nodeLevelId, locale, ctx }) {
  try {
    if (locale) {
      return await ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
        locationName: `node-level-${nodeLevelId}`,
        pluginName: 'curriculum',
        locale,
        useDefaultLocaleCallback: false,
      });
    }
    return await ctx.tx.call('dataset.dataset.getSchema', {
      locationName: `node-level-${nodeLevelId}`,
      pluginName: 'curriculum',
    });
  } catch (err) {
    return null;
  }
}

module.exports = { getNodeLevelSchema };
