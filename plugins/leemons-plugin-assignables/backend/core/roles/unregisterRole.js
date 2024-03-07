// TODO: Decide what happens with the existing assignables

const { LeemonsError } = require('@leemons/error');

// TODO: Unregister library category
async function unregisterRole({ role, ctx }) {
  if (!role) {
    throw new LeemonsError(ctx, {
      message: 'Role param is required',
      httpStatusCode: 400,
    });
  }

  const { deletedCount } = await ctx.tx.db.Roles.deleteMany({ name: role });

  return deletedCount > 0;
}

module.exports = { unregisterRole };
