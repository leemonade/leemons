const { table } = require('../tables');

async function getEmailWidthLogo({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-email-width-logo' }, { transacting });
  return config ? config.value : null;
}

module.exports = getEmailWidthLogo;
