const { table } = require('../tables');

async function getGeneral({ transacting } = {}) {
  const item = await table.config.findOne({ type: 'general' }, { transacting });
  let config = {
    enabled: true,
  };
  if (item) {
    config = JSON.parse(config);
  }
  return config;
}

module.exports = { getGeneral };
