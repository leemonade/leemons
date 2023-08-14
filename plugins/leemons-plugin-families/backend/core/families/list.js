const _ = require('lodash');
const { table } = require('../tables');

async function list(page, size, { query, transacting } = {}) {
  const results = await global.utils.paginate(table.families, page, size, query, {
    transacting,
  });

  return results;
}

module.exports = { list };
