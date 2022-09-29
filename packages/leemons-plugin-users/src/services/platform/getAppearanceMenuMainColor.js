const { table } = require('../tables');

async function getAppearanceMenuMainColor({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-appearance-menu-main-color' },
    { transacting }
  );
  return config ? config.value : '#212B3D';
}

module.exports = getAppearanceMenuMainColor;
