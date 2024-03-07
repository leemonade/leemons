const { LeemonsError } = require('@leemons/error');
const { uniq } = require('lodash');

async function getRoles({ roles, ctx }) {
  const uniqRoles = uniq(roles);

  const foundRoles = await ctx.tx.db.Roles.find({
    name: uniqRoles,
  }).lean();

  if (foundRoles.length >= uniqRoles?.length || false) {
    return Object.fromEntries(foundRoles.map((role) => [role.name, role]));
  }

  throw new LeemonsError(ctx, {
    message: 'Cannot get roles: Roles not found',
    httpStatusCode: 404,
  });
}

module.exports = { getRoles };
