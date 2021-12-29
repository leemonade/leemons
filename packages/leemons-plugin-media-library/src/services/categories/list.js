const { categories } = require('../tables');

module.exports = async function list(page = 0, size = 10, { transacting } = {}) {
  const result = await global.utils.paginate(
    categories,
    page,
    size,
    { id_$null: false },
    { transacting }
  );

  result.items = result.items.map((item) => ({
    name: item.name,
    displayName: item.displayName,
  }));

  return result;
};
