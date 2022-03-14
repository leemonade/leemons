const { tables } = require('../tables');
const { getByIds } = require('./getByIds');

async function getByAsset(assetId, { transacting } = {}) {
  try {
    const categories = await tables.assetCategories.find({ asset: assetId }, { transacting });
    return getByIds(categories.map(({ category }) => category));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get categories: ${e.message}`);
  }
}

module.exports = { getByAsset };
