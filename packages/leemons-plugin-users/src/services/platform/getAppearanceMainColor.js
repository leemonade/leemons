const { table } = require('../tables');

async function getAppearanceMainColor({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-appearance-main-color' },
    { transacting }
  );
  return config ? config.value : '#4F96FF';
}

module.exports = getAppearanceMainColor;
