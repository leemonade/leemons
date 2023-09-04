const _ = require('lodash');

async function getProgramCenters({ programId, ctx }) {
  const pc = await ctx.tx.db.ProgramCenter.find({ program: programId }).lean();
  return _.map(pc, 'center');
}

module.exports = { getProgramCenters };
