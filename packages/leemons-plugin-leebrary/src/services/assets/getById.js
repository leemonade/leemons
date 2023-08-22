const { tables } = require('../tables');

async function getById(assetId, { transacting } = {}) {
  return tables.assets.findOne({ id: assetId }, { transacting });
}

module.exports = { getById };
