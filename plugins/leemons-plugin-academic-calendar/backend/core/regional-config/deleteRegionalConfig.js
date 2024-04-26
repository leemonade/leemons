const { LeemonsError } = require('@leemons/error');

async function deleteRegionalConfig({ id, ctx }) {
  const calendarAssignedToAProgram = await ctx.tx.db.Config.find({
    regionalConfig: id,
  }).lean();

  if (calendarAssignedToAProgram.length > 0) {
    throw new LeemonsError(ctx, {
      message: 'This regional config is assigned to one or more programs',
    });
  }

  return ctx.tx.db.RegionalConfig.deleteOne({ id });
}

module.exports = { deleteRegionalConfig };
