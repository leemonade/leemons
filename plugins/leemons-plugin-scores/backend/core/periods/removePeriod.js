const { map } = require('lodash');
const { LeemonsError } = require('@leemons/error');

module.exports = async function removePeriod({ periodId, ctx }) {
  try {
    const period = await ctx.tx.db.Periods.findOne({ id: periodId }).lean();

    if (!period) {
      throw new LeemonsError(ctx, { message: 'period not found' });
    }

    const userAgents = map(ctx.meta.userSession.userAgents, 'id');

    if (!userAgents.includes(period.createdBy)) {
      throw new LeemonsError(ctx, { message: 'you are not the creator of this period' });
    }

    return await ctx.tx.db.Periods.deleteOne({
      id: periodId,
    });
  } catch (e) {
    throw new LeemonsError(ctx, { message: `Error removing period: ${e.message}` });
  }
};
