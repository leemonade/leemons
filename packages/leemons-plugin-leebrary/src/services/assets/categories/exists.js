const { tables } = require('../../tables');

async function exists(assetId, categoryId, { transacting } = {}) {
  const count = await tables.assetCategories.count(
    { asset: assetId, category: categoryId },
    { transacting }
  );
  return count > 0;
}

module.exports = { exists };
