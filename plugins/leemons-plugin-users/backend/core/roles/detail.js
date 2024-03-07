const { LeemonsError } = require('@leemons/error');

async function detail({ id, ctx }) {
  const role = await ctx.tx.db.Roles.findOne({ id }).lean();
  if (!role)
    throw new LeemonsError(ctx, { message: `No role found with id '${id}'`, httpStatusCode: 404 });
  role.permissions = await ctx.tx.db.RolePermission.find({ role: role.id }).lean();
  return role;
}

module.exports = { detail };
