const _ = require('lodash');

async function getProgramCenters({ programId, withDetails = false, ctx }) {
  const pc = await ctx.tx.db.ProgramCenter.find({ program: programId }).lean();

  const centerIds = _.map(pc, 'center');

  if (withDetails) {
    return ctx.tx.call('users.centers.getByIds', { ids: centerIds });
  }

  return centerIds;
}

module.exports = { getProgramCenters };
