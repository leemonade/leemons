const { LeemonsError } = require('@leemons/error');

const { generateJWTToken } = require('./jwt/generateJWTToken');

async function impersonateUser({ id, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ id }).lean();

  if (!user) {
    throw new LeemonsError(ctx, {
      message: 'User not found',
      customCode: 'USER_NOT_FOUND',
      httpStatusCode: 404,
    });
  }

  return await generateJWTToken({ payload: { id: user.id }, ctx });
}

module.exports = { impersonateUser };
