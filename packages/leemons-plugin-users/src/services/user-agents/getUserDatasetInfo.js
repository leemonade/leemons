async function getUserDatasetInfo(userId, { userSession, transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;
  let jsonSchema = null;
  let jsonUI = null;
  try {
    const { compileJsonSchema, compileJsonUI } = await datasetService.getSchemaWithLocale(
      'user-data',
      'plugins.users',
      userSession.locale,
      {
        userSession,
        transacting,
      }
    );
    jsonSchema = compileJsonSchema;
    jsonUI = compileJsonUI;
  } catch (e) {}
  const value = await datasetService.getValues(
    'user-data',
    'plugins.users',
    userSession.userAgents,
    {
      target: userId,
      transacting,
    }
  );

  return { jsonSchema, jsonUI, value };
}

module.exports = { getUserDatasetInfo };
