const { table } = require('../tables');

async function haveClasses({ transacting } = {}) {
  const count = await table.class.count({}, { transacting });
  return !!count;
}

module.exports = { haveClasses };
