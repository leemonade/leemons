const { categories } = require('../tables');

module.exports = async function unregister(category, { transacting } = {}) {
  const { name } = category;

  try {
    const deleted = await categories.deleteMany({ name }, { transacting });
    return deleted;
  } catch (e) {
    throw new Error(`Failed to unregister category: ${e.message}`);
  }
};
