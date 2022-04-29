const { tables } = require('../tables');

async function getById(id, { columns, transacting } = {}) {
  const category = await tables.categories.findOne({ id }, { columns, transacting });
  if (category && category.canUse) category.canUse = JSON.parse(category.canUse);
  return category;
}

module.exports = { getById };
