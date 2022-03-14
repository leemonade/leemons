const { tables } = require('../tables');

function getByIds(assetsIds, { transacting } = {}) {
  return tables.assets.find({ id_$in: assetsIds }, { transacting });
}

module.exports = { getByIds };
