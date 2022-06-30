const { tables } = require('../tables');

async function getByKey(key, { columns, transacting } = {}) {
  const category = await tables.categories.findOne({ key }, { columns, transacting });
  if (category && category.canUse) category.canUse = JSON.parse(category.canUse);
  return category;
}

module.exports = { getByKey };
