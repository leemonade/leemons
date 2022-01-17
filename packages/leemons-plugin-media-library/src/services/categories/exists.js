const { categories } = require('../tables');

module.exports = async function register(category, { transacting } = {}) {
  const { name } = category;
  const count = await categories.count({ name }, { transacting });

  return count > 0;
};
