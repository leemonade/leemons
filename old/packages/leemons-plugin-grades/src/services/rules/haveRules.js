const { table } = require('../tables');

async function haveRules({ isDependency = false, transacting } = {}) {
  const count = await table.rules.count({ isDependency }, { transacting });
  return !!count;
}

module.exports = { haveRules };
