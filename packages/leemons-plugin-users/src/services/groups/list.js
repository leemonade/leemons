const { table } = require('../tables');

async function list(page, size, { transacting, indexable = true } = {}) {
  const query = { indexable };
  if (indexable === 'all') delete query.indexable;

  const results = await global.utils.paginate(table.groups, page, size, query, {
    transacting,
  });

  return results;
}

module.exports = { list };
