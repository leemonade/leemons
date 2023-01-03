const { table } = require('../tables');

async function getLandscapeLogo({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-landscape-logo' }, { transacting });
  return config ? config.value : null;
}

module.exports = getLandscapeLogo;
