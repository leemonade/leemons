const _ = require('lodash');
const { table } = require('../tables');

async function saveData(userSession, value, { transacting } = {}) {
  const datasetService = leemons.getPlugin('dataset').services.dataset;
  const response = await datasetService.setValues(
    'user-data',
    'plugins.users',
    value,
    userSession.userAgents,
    {
      target: userSession.userAgents[0].id,
      transacting,
    }
  );
  await table.userAgent.update(
    { id: userSession.userAgents[0].id },
    { datasetIsGood: true },
    { transacting }
  );
  return response;
}

async function saveDataForUserAgentDatasets(userSession, data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Comprobamos si las ids de los userAgents coinciden
      if (!_.isEqual(_.map(userSession.userAgents, 'id'), _.map(data, 'userAgent'))) {
        throw new Error('UserAgents ids do not match');
      }
      return Promise.all(
        _.map(data, (d) =>
          saveData(
            {
              ...userSession,
              userAgents: [_.find(userSession.userAgents, { id: d.userAgent })],
            },
            d.value,
            { transacting }
          )
        )
      );
    },
    table.users,
    _transacting
  );
}

module.exports = { saveDataForUserAgentDatasets };
