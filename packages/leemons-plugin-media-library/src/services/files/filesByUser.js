const { files } = require('../tables');

async function filesByUser(userSession, { transacting } = {}) {
  return files.find({ fromUser: userSession.id }, { transacting });
}

module.exports = { filesByUser };
