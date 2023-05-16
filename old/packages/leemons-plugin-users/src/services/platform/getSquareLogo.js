const { table } = require('../tables');

async function getSquareLogo({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-square-logo' }, { transacting });
  return config ? config.value : null;
}

module.exports = getSquareLogo;
