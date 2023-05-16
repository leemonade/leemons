const _ = require('lodash');
const { table } = require('../tables');

async function getProgramCycles(ids, { transacting } = {}) {
  const cycles = await table.cycles.find(
    { program_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  return _.map(cycles, (cycle) => ({
    ...cycle,
    courses: JSON.parse(cycle.courses),
  }));
}

module.exports = { getProgramCycles };
