async function getRole({ role, ctx }) {
  if (!role) {
    throw new Error('Role param is required');
  }
  const foundRole = await ctx.tx.db.Roles.findOne({ name: role }).lean();

  if (foundRole) {
    return foundRole;
  }

  throw new Error('Role not found');
}

module.exports = { getRole };
