const { tables } = require('../../tables');
const { normalizeItemsArray } = require('../../shared');

async function remove(fileIds, assetId, { soft, transacting } = {}) {
  const query = {
    file_$in: normalizeItemsArray(fileIds),
  };

  if (assetId) {
    query.asset = assetId;
  }

  const deleted = await tables.assetsFiles.deleteMany(query, { soft, transacting });

  return deleted.count > 0;
}

module.exports = { remove };
