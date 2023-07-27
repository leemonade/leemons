const { tables } = require('../tables');

function getByKeys(keys, { transacting } = {}) {
  return tables.categories.find({ key_$in: keys }, { transacting });
}

module.exports = { getByKeys };
