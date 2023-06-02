const { table } = require('../tables');

async function getName({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-name' }, { transacting });
  return config ? config.value : null;
}

module.exports = getName;
