const { getPermissionType } = require('../../../instances/helpers/getPermissionType');

async function listAssignableInstancesUserHasPermissionTo({ ctx }) {
  const { userSession } = ctx.meta;

  const items = await ctx.tx.call(
    'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType',
    {
      userAgentId: userSession.userAgents.map((u) => u.id),
      type: getPermissionType({ ctx }),
    }
  );

  return items;
}

module.exports = { listAssignableInstancesUserHasPermissionTo };
