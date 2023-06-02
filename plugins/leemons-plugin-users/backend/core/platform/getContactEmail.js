const { table } = require('../tables');

async function getContactEmail({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-contact-email' }, { transacting });
  return config ? config.value : null;
}

module.exports = getContactEmail;
