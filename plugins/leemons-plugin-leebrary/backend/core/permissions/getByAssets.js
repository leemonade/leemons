const { flattenDeep, forEach, findIndex } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

async function getByAssets(assetIds, { showPublic, userSession, transacting } = {}) {
  const assetsIds = flattenDeep([assetIds]);

  try {
    const { services: userService } = leemons.getPlugin('users');
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    if (userSession && userSession?.userAgents) {
      const responses = await Promise.all([
        userService.permissions.getUserAgentPermissions(userSession.userAgents, {
          query: {
            $or: assetsIds.map((id) => ({ permissionName_$contains: getAssetPermissionName(id) })),
          },
          transacting,
        }),
        userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
          userSession.userAgents,
          leemons.plugin.prefixPN('asset.can-view'),
          { ignoreOriginalTarget: true, item: assetsIds, transacting }
        ),
        userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
          userSession.userAgents,
          leemons.plugin.prefixPN('asset.can-edit'),
          { ignoreOriginalTarget: true, item: assetsIds, transacting }
        ),
      ]);
      [permissions, viewItems, editItems] = responses;
    }

    const publicAssets = showPublic
      ? await tables.assets.find(
          { id_$in: assetsIds, public: true },
          { columns: ['id', 'public'], transacting }
        )
      : [];

    const results = permissions.concat(publicAssets).map((item) => ({
      asset: item.public ? item.id : getAssetIdFromPermissionName(item.permissionName),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions(item.public ? 'public' : item.actionNames[0]),
    }));

    forEach(viewItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index < 0) {
        results.push({
          asset,
          role: 'viewer',
          permissions: getRolePermissions('viewer'),
        });
      }
    });

    forEach(editItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index >= 0) {
        if (results[index].role === 'viewer') {
          results[index].role = 'editor';
          results[index].permissions = getRolePermissions('editor');
        }
      } else {
        results.push({
          asset,
          role: 'editor',
          permissions: getRolePermissions('editor'),
        });
      }
    });

    return results;
  } catch (e) {
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAssets };
