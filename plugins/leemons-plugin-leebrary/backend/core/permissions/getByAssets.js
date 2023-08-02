const { flattenDeep, forEach, findIndex } = require('lodash');
const { LeemonsError } = require('leemons-error');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

async function getByAssets({ assetIds, showPublic, ctx }) {
  const { userSession } = ctx.meta;
  const assetsIds = flattenDeep([assetIds]);

  try {
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    if (userSession && userSession?.userAgents) {
      const responses = await Promise.all([
        ctx.tx.call('users.permissions.getUserAgentPermissions', {
          userAgents: userSession.userAgents,
          query: {
            // $or: assetsIds.map((id) => ({ permissionName_$contains: getAssetPermissionName(id) })),
            $or: assetsIds.map((id) => ({ permissionName: `/${getAssetPermissionName(id)}/` })),
          },
        }),

        ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
          userAgentId: userSession.userAgents,
          type: ctx.prefixPN('asset.can-view'),
          ignoreOriginalTarget: true,
          item: assetsIds,
        }),

        ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
          userAgentId: userSession.userAgents,
          type: ctx.prefixPN('asset.can-edit'),
          ignoreOriginalTarget: true,
          item: assetsIds,
        }),
      ]);
      [permissions, viewItems, editItems] = responses;
    }

    const publicAssets = showPublic
      ? await ctx.tx.db.Assets.find({ id: assetsIds, public: true }).select(['id', 'public']).lean()
      : [];

    const results = permissions.concat(publicAssets).map((item) => ({
      asset: item.public ? item.id : getAssetIdFromPermissionName(item.permissionName),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions({ role: item.public ? 'public' : item.actionNames[0], ctx }),
    }));

    forEach(viewItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index < 0) {
        results.push({
          asset,
          role: 'viewer',
          permissions: getRolePermissions({ role: 'viewer', ctx }),
        });
      }
    });

    forEach(editItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index >= 0) {
        if (results[index].role === 'viewer') {
          results[index].role = 'editor';
          results[index].permissions = getRolePermissions({ role: 'editor', ctx });
        }
      } else {
        results.push({
          asset,
          role: 'editor',
          permissions: getRolePermissions({ role: 'editor', ctx }),
        });
      }
    });

    return results;
  } catch (e) {
    console.error(e);
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAssets };
