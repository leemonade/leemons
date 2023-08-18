// TODO: Decide what happens with the existing assignables
// TODO: Unregister library category
async function unregisterRole({ role, ctx }) {
  if (!role) {
    throw new Error('Role param is required');
  }

  const { deletedCount } = await ctx.tx.db.Roles.deleteMany({ name: role });

  return deletedCount > 0;
}

module.exports = { unregisterRole };
