const { map, uniqBy, pick } = require('lodash');

const { getParentAssignables } = require('./getParentAssignables');
/**
 * Retrieves the parent permissions for a given set of IDs and context.
 *
 * @param {Object} options - The options for retrieving the parent permissions.
 * @param {Array} options.ids - The IDs for which to retrieve parent permissions.
 * @param {MoleculerContext} options.ctx - The Moleculer context.
 * @return {Promise<Array>} A promise that resolves to an array of parent permissions.
 */
async function getParentPermissions({ ids, ctx }) {
  const parents = await getParentAssignables({ ids, ctx });
  const assetsIds = Object.keys(parents);
  const itemPermissions = await ctx.tx.call(
    'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType',
    {
      userAgentId: map(ctx.meta.userSession.userAgents, 'id'),
      type: 'leebrary.asset.can-assign',
      ignoreOriginalTarget: true,
      item: assetsIds,
    }
  );

  const activitiesWithPermissions = uniqBy(
    Object.values(pick(parents, itemPermissions)).flat(),
    'activity'
  );

  return activitiesWithPermissions.map(({ activity }) => [activity, ['view']]);
}

module.exports = {
  getParentPermissions,
};
