const { table } = require('../tables');

async function existSubstageInProgram(id, program, { transacting } = {}) {
  const count = await table.groups.count({ id, program, type: 'substage' }, { transacting });
  return count > 0;
}

module.exports = { existSubstageInProgram };
