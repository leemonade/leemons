const { tables } = require('../tables');

async function getByAsset(assetId, { columns, userSession, transacting } = {}) {
  const query = { asset: assetId };

  if (userSession?.userAgents) {
    query.userAgent = userSession.userAgents[0].id;
    return tables.pins.findOne(query, { columns, transacting });
  }

  return tables.pins.find(query, { columns, transacting });
}

module.exports = { getByAsset };
