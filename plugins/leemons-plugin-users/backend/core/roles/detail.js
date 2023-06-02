async function detail({ _id, ctx }) {
  const role = await ctx.tx.db.Roles.findOne({ _id }).lean();
  if (!role) throw new global.utils.HttpError(404, `No role found with id '${_id}'`);
  role.permissions = await ctx.tx.db.RolePermission.find({ role: role._id }).lean();
  return role;
}

module.exports = { detail };
