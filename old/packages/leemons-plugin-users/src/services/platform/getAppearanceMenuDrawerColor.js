const { table } = require('../tables');

async function getAppearanceMenuDrawerColor({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-appearance-menu-drawer-color' },
    { transacting }
  );
  return config ? config.value : '#333F56';
}

module.exports = getAppearanceMenuDrawerColor;
