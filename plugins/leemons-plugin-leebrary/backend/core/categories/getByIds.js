const { tables } = require('../tables');

function getByIds(categoriesIds, { transacting } = {}) {
  return tables.categories.find({ id_$in: categoriesIds }, { transacting });
}

module.exports = { getByIds };
