const { table } = require('../tables');

async function setAppearanceMenuDrawerColor(color, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-appearance-menu-drawer-color' },
    {
      key: 'platform-appearance-menu-drawer-color',
      value: color,
    },
    { transacting }
  );
}

module.exports = setAppearanceMenuDrawerColor;
