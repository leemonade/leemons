async function getUserDatasetInfo({ userId, ctx }) {
  let jsonSchema = null;
  let jsonUI = null;
  try {
    const { compileJsonSchema, compileJsonUI } = await ctx.tx.call(
      'dataset.dataset.getSchemaWithLocale',
      {
        locationName: 'user-data',
        pluginName: 'users',
        locale: ctx.userSession.locale,
      }
    );
    jsonSchema = compileJsonSchema;
    jsonUI = compileJsonUI;
  } catch (e) {}
  const value = await ctx.tx.call('dataset.dataset.getValues', {
    locationName: 'user-data',
    pluginName: 'users',
    userAgent: ctx.userSession.userAgents,
    target: userId,
  });

  return { jsonSchema, jsonUI, value };
}

module.exports = { getUserDatasetInfo };
