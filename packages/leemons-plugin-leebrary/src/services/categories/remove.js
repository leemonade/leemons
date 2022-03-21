const { tables } = require('../tables');

async function remove(category, { transacting } = {}) {
  const { key } = category;

  try {
    const deleted = await tables.categories.deleteMany({ key }, { transacting });
    return deleted;
  } catch (e) {
    throw new Error(`Failed to remove category: ${e.message}`);
  }
}

module.exports = { remove };
