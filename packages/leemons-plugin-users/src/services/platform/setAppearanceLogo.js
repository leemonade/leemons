const { table } = require('../tables');

async function setAppearanceLogo(logo, { transacting } = {}) {
  return table.config.set(
    { key: 'platform-appearance-logo' },
    {
      key: 'platform-appearance-logo',
      value: logo,
    },
    { transacting }
  );
}

module.exports = setAppearanceLogo;
