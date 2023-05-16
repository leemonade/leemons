const { table } = require('../tables');

async function listGroups(page, size, program, { query, transacting } = {}) {
  return global.utils.paginate(
    table.groups,
    page,
    size,
    { ...query, program, type: 'group' },
    {
      transacting,
    }
  );
}

module.exports = { listGroups };
