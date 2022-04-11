const { tables } = require('../tables');

async function getById(id, { columns, transacting } = {}) {
  return tables.categories.findOne({ id }, { columns, transacting });
}

module.exports = { getById };
