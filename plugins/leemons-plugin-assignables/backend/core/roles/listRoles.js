async function listRoles({ ctx }) {
  const rolesList = await ctx.tx.db.Roles.find({}, 'name').lean();

  return rolesList.map((role) => role.name);
}

module.exports = { listRoles };
