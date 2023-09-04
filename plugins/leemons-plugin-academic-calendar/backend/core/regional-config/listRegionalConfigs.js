const _ = require('lodash');

async function listRegionalConfigs({ center, ctx }) {
  const regionalConfigs = await ctx.tx.db.RegionalConfig.find({ center }).lean();
  return _.map(regionalConfigs, (regionalConfig) => ({
    ...regionalConfig,
    regionalEvents: JSON.parse(regionalConfig.regionalEvents),
    localEvents: JSON.parse(regionalConfig.localEvents),
    daysOffEvents: JSON.parse(regionalConfig.daysOffEvents),
  }));
}

module.exports = { listRegionalConfigs };
