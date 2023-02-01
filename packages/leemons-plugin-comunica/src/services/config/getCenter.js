const { table } = require('../tables');

async function getCenter(center, { transacting } = {}) {
  const item = await table.config.findOne({ type: 'center', typeId: center }, { transacting });
  let config = {};
  if (item) {
    config = JSON.parse(config);
  }
  return config;
}

module.exports = { getCenter };
