const _ = require('lodash');

async function removeProgramConfigsByProgramIds({ programIds, soft, ctx }) {
  const configs = await ctx.tx.db.Configs.find({
    $or: _.map(_.isArray(programIds) ? programIds : [programIds], (programId) => ({
      key: `/^program-${programId}/i`,
    })),
  }).lean();
  await ctx.tx.emit('before-remove-program-configs', {
    configs,
    soft,
  });
  await ctx.tx.db.Configs.deleteMany({ id: _.map(configs, 'id') }, { soft });
  await ctx.tx.emit('after-remove-program-configs', {
    configs,
    soft,
  });
  return true;
}

module.exports = { removeProgramConfigsByProgramIds };
