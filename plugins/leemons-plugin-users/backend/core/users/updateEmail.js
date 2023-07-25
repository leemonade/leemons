const { LeemonsError } = require('packages/leemons-error/src');

async function updateEmail({ id, email, ctx }) {
  const user = await ctx.tx.db.Users.findOne({ id: { $ne: id }, email }).lean();

  if (user) {
    throw new LeemonsError(ctx, { message: 'Email already exists' });
  }

  return ctx.tx.db.Users.findOneAndUpdate({ id }, { email }, { new: true });
}

module.exports = { updateEmail };
