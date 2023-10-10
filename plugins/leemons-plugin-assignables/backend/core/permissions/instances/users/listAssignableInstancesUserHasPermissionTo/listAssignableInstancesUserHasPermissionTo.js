const { getPermissionType } = require('../../../instances/helpers/getPermissionType');

/**
 * Retrieves a list of instances that the user has permission to assign.
 *
 * @param {MoleculerContext} ctx - The Moleculer context.e user's session object.
 * @return {Promise<Object[]>} A promise that resolves to an array of items that the user has permission to assign.
 */
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
