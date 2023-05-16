const { tables } = require('../tables');

async function getByAsset(assetId, { columns, transacting } = {}) {
  return tables.bookmarks.findOne({ asset: assetId }, { columns, transacting });
}

module.exports = { getByAsset };
