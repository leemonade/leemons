const { table } = require('../tables');

async function getAppearanceDarkMode({ transacting } = {}) {
  const config = await table.config.findOne(
    { key: 'platform-appearance-dark-mode' },
    { transacting }
  );
  return Boolean(config?.value);
}

module.exports = getAppearanceDarkMode;
