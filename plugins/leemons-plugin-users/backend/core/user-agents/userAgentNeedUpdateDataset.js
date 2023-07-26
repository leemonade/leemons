async function userSessionUserAgentNeedUpdateDataset({ ctx }) {
  let schema;
  try {
    schema = await ctx.tx.call('dataset.dataset.getSchemaWithLocale', {
      locationName: 'user-data',
      pluginName: 'users',
      locale: ctx.userSession.locale,
    });
  } catch (e) {
    ctx.logger.error(e);
  }

  if (!schema) {
    return false;
  }

  if (
    schema.compileJsonSchema &&
    schema.compileJsonSchema.properties &&
    Object.keys(schema.compileJsonSchema.properties).length
  ) {
    const values = await ctx.tx.call('dataset.dataset.getValues', {
      locationName: 'user-data',
      pluginName: 'users',
      userAgent: ctx.userSession.userAgents,
      target: ctx.userSession.userAgents[0].id,
    });

    try {
      await ctx.tx.call('dataset.dataset.validateDataForJsonSchema', {
        jsonSchema: schema.compileJsonSchema,
        data: values || {},
      });
    } catch (e) {
      return true;
    }
  }

  return false;
}

module.exports = { userSessionUserAgentNeedUpdateDataset };
