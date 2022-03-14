const { tables } = require('../tables');

async function exists(category, { transacting } = {}) {
  const { key } = category;
  const count = await tables.categories.count({ key }, { transacting });
  return count > 0;
}

module.exports = { exists };
