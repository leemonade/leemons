const { table } = require('../tables');

async function getAppearanceLogo({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-appearance-logo' }, { transacting });
  return config ? config.value : null;
}

module.exports = getAppearanceLogo;
