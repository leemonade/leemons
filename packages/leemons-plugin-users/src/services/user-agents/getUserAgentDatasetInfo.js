const _ = require('lodash');
const { table } = require('../tables');

async function getUserAgentDatasetInfo(userAgentId, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;
  const userAgent = await table.userAgent.findOne({ id: userAgentId });
  const userSession = await table.users.findOne({ id: userAgent.user });
  userSession.userAgents = [userAgent];
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
      target: userSession.userAgents[0].id,
      transacting,
    }
  );

  return { jsonSchema, jsonUI, value };
}

module.exports = { getUserAgentDatasetInfo };
