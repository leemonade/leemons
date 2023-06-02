const { table } = require('../tables');

async function getPicturesEmptyStates({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-pictures-empty-states' },
    { transacting }
  );
  return Boolean(config?.value);
}

module.exports = getPicturesEmptyStates;
