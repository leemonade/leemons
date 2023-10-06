const { map, uniqBy, pick } = require('lodash');

const { getParentAssignables } = require('./getParentAssignables');

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
