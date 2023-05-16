const { tables } = require('../tables');

async function getIndexables(assetIds = [], { columns, transacting } = {}) {
  return tables.assets.find({ id_$in: assetIds, indexable: true }, { columns, transacting });
}

module.exports = { getIndexables };
