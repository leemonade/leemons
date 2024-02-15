async function getUserDatasetInfo({ userId, ctx }) {
  let jsonSchema = null;
  let jsonUI = null;
  try {
    const { compileJsonSchema, compileJsonUI } = await ctx.tx.call(
      'dataset.dataset.getSchemaWithLocale',
      {
        locationName: 'user-data',
        pluginName: 'users',
        locale: ctx.meta.userSession.locale,
      }
    );
    jsonSchema = compileJsonSchema;
    jsonUI = compileJsonUI;
  } catch (e) {
    console.error(`Error getting user dataset info for locale "${ctx.meta.userSession.locale}"`, e);
  }
  const value = await ctx.tx.call('dataset.dataset.getValues', {
    locationName: 'user-data',
    pluginName: 'users',
    userAgent: ctx.meta.userSession.userAgents,
    target: userId,
  });

  return { jsonSchema, jsonUI, value };
}

module.exports = { getUserDatasetInfo };
