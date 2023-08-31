const { LeemonsError } = require('leemons-error');

async function getRole({ role, ctx }) {
  if (!role) {
    throw new LeemonsError(ctx, { message: 'Role param is required', httpStatusCode: 400 });
  }
  const foundRole = await ctx.tx.db.Roles.findOne({ name: role }).lean();

  if (foundRole) {
    return foundRole;
  }

  throw new LeemonsError(ctx, { message: 'Role not found', httpStatusCode: 404 });
}

module.exports = { getRole };
