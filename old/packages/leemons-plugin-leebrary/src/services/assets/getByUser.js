const { tables } = require('../tables');

async function getByUser(userId, { transacting } = {}) {
  return tables.assets.find({ fromUser: userId }, { transacting });
}

module.exports = { getByUser };
