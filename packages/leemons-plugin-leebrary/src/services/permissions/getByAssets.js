const { flattenDeep, forEach, findIndex, difference } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

async function getByAssets(assetIds, { showPublic, userSession, onlyShared, transacting } = {}) {
  let assetsIds = flattenDeep([assetIds]);

  try {
    const { services: userService } = leemons.getPlugin('users');
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    let assignItems = [];
    if (userSession && userSession?.userAgents) {
      permissions = await userService.permissions.getUserAgentPermissions(userSession.userAgents, {
        query: {
          $or: assetsIds.map((id) => ({ permissionName_$contains: getAssetPermissionName(id) })),
        },
        transacting,
      });
    }

    if (onlyShared) {
      const assetIdsOwner = [];
      const newPermissions = [];
      forEach(permissions, (item) => {
        if (item.actionNames.includes('owner')) {
          assetIdsOwner.push(getAssetIdFromPermissionName(item.permissionName));
        } else {
          newPermissions.push(item);
        }
      });
      permissions = newPermissions;
      assetsIds = difference(assetsIds, assetIdsOwner);
    }

    if (userSession && userSession?.userAgents) {
      const responses = await Promise.all([
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
        userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
          userSession.userAgents,
          leemons.plugin.prefixPN('asset.can-assign'),
          { ignoreOriginalTarget: true, item: assetsIds, transacting }
        ),
      ]);
      [viewItems, editItems, assignItems] = responses;
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

    forEach(assignItems, (asset) => {
      const index = findIndex(results, { asset });
      if (index >= 0) {
        if (results[index].role === 'viewer') {
          results[index].role = 'assigner';
          results[index].permissions = getRolePermissions('assigner');
        }
      } else {
        results.push({
          asset,
          role: 'assigner',
          permissions: getRolePermissions('assigner'),
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
