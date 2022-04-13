const { tables } = require('../tables');

async function getByKey(key, { columns, transacting } = {}) {
  return tables.categories.findOne({ key }, { columns, transacting });
}

module.exports = { getByKey };
