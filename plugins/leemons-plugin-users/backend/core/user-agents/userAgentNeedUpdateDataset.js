const _ = require('lodash');
const { table } = require('../tables');

async function userSessionUserAgentNeedUpdateDataset(userSession, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;

  let schema;
  try {
    schema = await datasetService.getSchemaWithLocale(
      'user-data',
      'plugins.users',
      userSession.locale,
      {
        userSession,
        transacting,
      }
    );
  } catch (e) {
    console.log('ERROR');
    console.error(e);
  }

  if (!schema) {
    return false;
  }

  if (
    schema.compileJsonSchema &&
    schema.compileJsonSchema.properties &&
    Object.keys(schema.compileJsonSchema.properties).length
  ) {
    const values = await datasetService.getValues(
      'user-data',
      'plugins.users',
      userSession.userAgents,
      {
        target: userSession.userAgents[0].id,
        transacting,
      }
    );

    try {
      datasetService.validateDataForJsonSchema(schema.compileJsonSchema, values || {});
    } catch (e) {
      return true;
    }
  }

  return false;
}

module.exports = { userSessionUserAgentNeedUpdateDataset };
