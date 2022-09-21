const { table } = require('../tables');

async function getAppearanceMainColor({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-appearance-main-color' },
    { transacting }
  );
  return config ? config.value : '#3B76CC';
}

module.exports = getAppearanceMainColor;
