const { table } = require('../tables');

async function saveGeneral(config, { transacting } = {}) {
  await table.config.set(
    { type: 'general' },
    {
      type: 'general',
      config: JSON.stringify(config),
    },
    { transacting }
  );
  return config;
}

module.exports = { saveGeneral };
