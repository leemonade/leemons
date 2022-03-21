const { tables } = require('../tables');
const { getByIds } = require('./getByIds');

async function getByAsset(assetId, { transacting } = {}) {
  try {
    const categories = await tables.assetCategories.find({ asset: assetId }, { transacting });
    return getByIds(categories.map(({ category }) => category));
  } catch (e) {
    throw new Error(`Failed to get categories: ${e.message}`);
  }
}

module.exports = { getByAsset };
