const { table } = require('../tables');

async function saveCenter(center, config, { transacting } = {}) {
  await table.config.set(
    { type: 'center', typeId: center },
    {
      type: 'center',
      typeId: center,
      config: JSON.stringify(config),
    },
    { transacting }
  );
  return config;
}

module.exports = { saveCenter };
