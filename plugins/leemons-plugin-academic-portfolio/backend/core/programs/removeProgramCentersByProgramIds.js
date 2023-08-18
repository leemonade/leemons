const _ = require('lodash');

async function removeProgramCentersByProgramIds({ programIds, soft, ctx }) {
  const programCenter = await ctx.tx.db.ProgramCenter.find({
    program: _.isArray(programIds) ? programIds : [programIds],
  }).lean();
  await ctx.tx.emit('before-remove-program-center', {
    programCenter,
    soft,
  });
  await ctx.tx.db.ProgramCenter.deleteMany({ id: _.map(programCenter, 'id') }, { soft });
  await ctx.tx.emit('after-remove-program-center', {
    programCenter,
    soft,
  });
  return true;
}

module.exports = { removeProgramCentersByProgramIds };
