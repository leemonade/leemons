const { tables } = require('../tables');

async function exists(fileId, { transacting } = {}) {
  const count = await tables.files.count({ id: fileId }, { transacting });
  return count > 0;
}

module.exports = { exists };
