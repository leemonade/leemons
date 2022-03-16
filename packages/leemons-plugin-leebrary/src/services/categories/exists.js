const { tables } = require('../tables');

async function exists(id, { transacting } = {}) {
  const count = await tables.categories.count({ id }, { transacting });
  return count > 0;
}

module.exports = { exists };
