const _ = require('lodash');

async function getProgramCycles({ ids, ctx }) {
  const cycles = await ctx.tx.db.Cycles.find({ program: _.isArray(ids) ? ids : [ids] }).lean();
  return _.map(cycles, (cycle) => ({
    ...cycle,
    courses: JSON.parse(cycle.courses || null),
  }));
}

module.exports = { getProgramCycles };
