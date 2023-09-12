const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

/**
 * Add calendar config
 * @public
 * @static
 * @param {any} items - Calendar data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addMany({ items, ctx }) {
  const centerIds = _.map(items, 'center');
  const count = await ctx.tx.db.CenterCalendarConfigs.countDocuments({ center: centerIds });
  if (count)
    throw new LeemonsError(ctx, {
      message: 'One of the centers is already assigned to a configuration',
    });
  const result = await ctx.tx.db.CenterCalendarConfigs.insertMany(items);
  return _.map(result, (r) => r.toObject());
}

module.exports = { addMany };
