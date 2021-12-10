const { table } = require('../tables');

async function listGroups(page, size, program, { transacting } = {}) {
  return global.utils.paginate(
    table.groups,
    page,
    size,
    { program, type: 'group' },
    {
      transacting,
    }
  );
}

module.exports = { listGroups };
