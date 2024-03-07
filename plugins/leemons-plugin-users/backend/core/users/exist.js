const { LeemonsError } = require('@leemons/error');

/**
 * Check if user exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @return {Promise<boolean>}
 * */
async function exist({ query, throwErrorIfNotExists, ctx }) {
  const count = await ctx.tx.db.Users.countDocuments(query);
  if (throwErrorIfNotExists && !count) throw new LeemonsError(ctx, { message: 'User not found' });
  return !!count;
}

module.exports = {
  exist,
};
