const { LeemonsError } = require('@leemons/error');
/**
 * Check if group exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @return {Promise<boolean>}
 * */
async function exist({ query, throwErrorIfNotExists, ctx }) {
  const count = await ctx.tx.db.Groups.countDocuments(query);
  if (throwErrorIfNotExists && !count) throw new LeemonsError(ctx, { message: 'Group not found' });
  return true;
}

module.exports = { exist };
