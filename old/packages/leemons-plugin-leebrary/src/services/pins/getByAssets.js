const { flattenDeep } = require('lodash');
const { tables } = require('../tables');

async function getByAssets(assetIds, { columns, userSession, transacting } = {}) {
  const assetsIds = flattenDeep([assetIds]);

  const query = { asset_$in: assetsIds };

  if (userSession?.userAgents) {
    query.userAgent = userSession.userAgents[0].id;
  }

  return tables.pins.find(query, { columns, transacting });
}

module.exports = { getByAssets };
