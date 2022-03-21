const { table } = require('../tables');

async function getPreferences(user, { transacting } = {}) {
  return table.userPreferences.findOne({ user }, { transacting });
}

module.exports = { getPreferences };
