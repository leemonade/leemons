const { table } = require('../tables');

async function havePrograms({ transacting } = {}) {
  const count = await table.programs.count({}, { transacting });
  return !!count;
}

module.exports = { havePrograms };
