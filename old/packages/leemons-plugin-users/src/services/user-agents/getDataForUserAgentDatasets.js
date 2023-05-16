const _ = require('lodash');

async function getData(userSession, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;

  const [{ compileJsonSchema, compileJsonUI }, value] = await Promise.all([
    datasetService.getSchemaWithLocale('user-data', 'plugins.users', userSession.locale, {
      userSession,
      transacting,
    }),
    datasetService.getValues('user-data', 'plugins.users', userSession.userAgents, {
      target: userSession.userAgents[0].id,
      transacting,
    }),
  ]);

  return { jsonSchema: compileJsonSchema, jsonUI: compileJsonUI, value };
}

async function getDataForUserAgentDatasets(userSession, { transacting } = {}) {
  return Promise.all(
    _.map(userSession.userAgents, async (userAgent) => {
      const data = await getData({ ...userSession, userAgents: [userAgent] }, { transacting });

      return {
        userAgent,
        data,
      };
    })
  );
}

module.exports = { getDataForUserAgentDatasets };
