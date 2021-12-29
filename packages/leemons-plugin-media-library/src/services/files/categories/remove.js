const { fileCategories } = require('../../tables');

module.exports = async function remove(asset, category, { transacting } = {}) {
  const { id } = asset;

  try {
    const query = {
      asset: id,
    };

    if (category?.name) {
      query.category = category.name;
    }
    const deleted = await fileCategories.deleteMany(query, { transacting });
    return {
      deleted: deleted.count,
      soft: deleted.soft,
    };
  } catch (e) {
    throw new Error(`Failed to delete category: ${e.message}`);
  }
};
