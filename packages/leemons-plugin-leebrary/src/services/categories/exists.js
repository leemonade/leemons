const { tables } = require('../tables');

async function exists(categoryData, { transacting } = {}) {
  const query = {};
  if (categoryData.id) {
    query.id = categoryData.id;
  }

  if (categoryData.key) {
    query.key = categoryData.key;
  }

  const count = await tables.categories.count(query, { transacting });
  return count > 0;
}

module.exports = { exists };
