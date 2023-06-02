const { table } = require('../tables');

async function setAppearanceMenuMainColor(color, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-appearance-menu-main-color' },
    {
      key: 'platform-appearance-menu-main-color',
      value: color,
    },
    { transacting }
  );
}

module.exports = setAppearanceMenuMainColor;
