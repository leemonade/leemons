const _ = require('lodash');
const { table } = require('../tables');

async function listRegionalConfigs(center, { transacting } = {}) {
  const regionalConfigs = await table.regionalConfig.find({ center }, { transacting });
  return _.map(regionalConfigs, (regionalConfig) => ({
    ...regionalConfig,
    regionalEvents: JSON.parse(regionalConfig.regionalEvents),
    localEvents: JSON.parse(regionalConfig.localEvents),
    daysOffEvents: JSON.parse(regionalConfig.daysOffEvents),
  }));
}

module.exports = { listRegionalConfigs };
