const { tables } = require('../../tables');

async function remove(assetId, categoryId, { transacting } = {}) {
  try {
    const query = {
      asset: assetId,
    };

    if (categoryId) {
      query.category = categoryId;
    }

    const deleted = await tables.assetCategories.deleteMany(query, { transacting });
    return {
      deleted: deleted.count,
      soft: deleted.soft,
    };
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete category: ${e.message}`);
  }
}

module.exports = { remove };
