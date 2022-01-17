const { categories } = require('../tables');
const exists = require('./exists');

module.exports = async function register(category, { transacting } = {}) {
  const { name, displayName } = category;

  if (!name.length) {
    throw new Error('Category name is required');
  }

  if (!displayName.length) {
    throw new Error('Category display name is required');
  }

  const finalCategory = {
    name: name.toLowerCase(),
    displayName,
  };

  if (await exists(finalCategory, { transacting })) {
    return 0;
  }

  try {
    await categories.create(finalCategory, { transacting });
    return 1;
  } catch (e) {
    throw new Error(`Failed to register category: ${e.message}`);
  }
};
