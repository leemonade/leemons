const { tables } = require('../tables');

async function list(page = 0, size = 10, { transacting } = {}) {
  const result = await global.utils.paginate(
    tables.categories,
    page,
    size,
    { id_$null: false, $sort: 'order:asc' },
    { transacting }
  );

  return result;
}

module.exports = { list };
