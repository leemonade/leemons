const { flattenDeep } = require('lodash');

async function getByAssets({ assetIds, columns, ctx }) {
  const assetsIds = flattenDeep([assetIds]);
  const { userSession } = ctx.meta;
  const query = { asset: assetsIds };

  if (userSession?.userAgents) {
    query.userAgent = userSession.userAgents[0].id;
  }

  return ctx.tx.db.Pins.find(query).select(columns).lean();
}

module.exports = { getByAssets };
