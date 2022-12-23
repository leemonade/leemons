const { table } = require('../tables');

async function setAppearanceMainColor(color, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-appearance-main-color' },
    {
      key: 'platform-appearance-main-color',
      value: color,
    },
    { transacting }
  );
}

module.exports = setAppearanceMainColor;
