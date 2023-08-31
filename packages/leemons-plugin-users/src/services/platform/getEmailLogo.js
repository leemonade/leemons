const { table } = require('../tables');

async function getEmailLogo({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-email-logo' }, { transacting });
  return config ? config.value : null;
}

module.exports = getEmailLogo;
