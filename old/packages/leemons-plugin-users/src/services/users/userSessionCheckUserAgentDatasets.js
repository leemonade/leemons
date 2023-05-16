const _ = require('lodash');
const { table } = require('../tables');
const {
  userSessionUserAgentNeedUpdateDataset,
} = require('../user-agents/userAgentNeedUpdateDataset');

async function checkUserAgentDataset(userAgent, userSession, { transacting } = {}) {
  let good = true;
  if (!userAgent.datasetIsGood) {
    const needUpdate = await userSessionUserAgentNeedUpdateDataset(
      {
        ...userSession,
        userAgents: [userAgent],
      },
      { transacting }
    );
    if (!needUpdate) {
      await table.userAgent.update({ id: userAgent.id }, { datasetIsGood: true }, { transacting });
    } else {
      good = false;
    }
  }
  return good;
}

async function userSessionCheckUserAgentDatasets(userSession, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      let good = true;
      if (userSession && _.isArray(userSession.userAgents) && userSession.userAgents.length) {
        const results = await Promise.all(
          userSession.userAgents.map((userAgent) =>
            checkUserAgentDataset(userAgent, userSession, { transacting })
          )
        );
        _.forEach(results, (result) => {
          if (!result) {
            good = false;
          }
        });
      }
      return good;
    },
    table.userAgent,
    _transacting
  );
}

module.exports = { userSessionCheckUserAgentDatasets };
