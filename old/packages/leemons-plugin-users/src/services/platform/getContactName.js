const { table } = require('../tables');

async function getContactPhone({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-contact-name' }, { transacting });
  return config ? config.value : null;
}

module.exports = getContactPhone;
