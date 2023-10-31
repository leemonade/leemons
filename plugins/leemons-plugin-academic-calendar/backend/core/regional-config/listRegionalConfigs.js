const _ = require('lodash');

async function listRegionalConfigs({ center, ctx }) {
  const regionalConfigs = await ctx.tx.db.RegionalConfig.find({ center }).lean();
  return _.map(regionalConfigs, (regionalConfig) => ({
    ...regionalConfig,
    regionalEvents: JSON.parse(regionalConfig.regionalEvents || null),
    localEvents: JSON.parse(regionalConfig.localEvents || null),
    daysOffEvents: JSON.parse(regionalConfig.daysOffEvents || null),
  }));
}

module.exports = { listRegionalConfigs };
