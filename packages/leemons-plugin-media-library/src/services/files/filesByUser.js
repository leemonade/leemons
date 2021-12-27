const { table } = require('../tables');

async function filesByUser(userSession, { transacting } = {}) {
  return table.files.find({ fromUser: userSession.id }, { transacting });
}

module.exports = { filesByUser };
