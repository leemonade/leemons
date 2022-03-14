const { tables } = require('../tables');

async function getByUser(userId, { transacting } = {}) {
  return tables.files.find({ fromUser: userId }, { transacting });
}

module.exports = { getByUser };
