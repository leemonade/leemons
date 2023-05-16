const { table } = require('../tables');

async function existGroupInProgram(id, program, { transacting } = {}) {
  const count = await table.groups.count({ id, program, type: 'group' }, { transacting });
  return count > 0;
}

module.exports = { existGroupInProgram };
