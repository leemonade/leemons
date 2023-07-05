async function detail({ id, ctx }) {
  const role = await ctx.tx.db.Roles.findOne({ id }).lean();
  if (!role) throw new global.utils.HttpError(404, `No role found with id '${id}'`);
  role.permissions = await ctx.tx.db.RolePermission.find({ role: role.id }).lean();
  return role;
}

module.exports = { detail };
