const { flattenDeep, forEach, findIndex, difference } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

/**
 * This function handles the permissions that are only shared. It filters out the 'owner' permissions
 * and returns the remaining permissions along with the asset IDs that do not have 'owner' permissions.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.permissions - The list of permissions.
 * @param {Array} params.assetsIds - The list of asset IDs.
 * @returns {Array} An array containing the new permissions and the difference of asset IDs and asset IDs with 'owner' permissions.
 */
function handleOnlyShared({ permissions, assetsIds }) {
  const assetIdsOwner = [];
  const newPermissions = [];
  forEach(permissions, (item) => {
    if (item.actionNames.includes('owner')) {
      assetIdsOwner.push(getAssetIdFromPermissionName(item.permissionName));
    } else {
      newPermissions.push(item);
    }
  });
  return [newPermissions, difference(assetsIds, assetIdsOwner)];
}

/**
 * This asynchronous function handles the permissions for each item. It retrieves the permissions for each user agent
 * for each permission type ('asset.can-view', 'asset.can-edit', 'asset.can-assign') and returns the responses.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.assetsIds - The list of asset IDs.
 * @param {Array} params.userAgents - The list of user agents.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} An array containing the responses for each permission type for each user agent.
 */
async function handleItemPermissions({ assetsIds, userAgents, transacting }) {
  const { services: userService } = leemons.getPlugin('users');
  const permissionTypes = ['asset.can-view', 'asset.can-edit', 'asset.can-assign'];

  const responses = await Promise.all(permissionTypes.map(type =>
    userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
      userAgents,
      leemons.plugin.prefixPN(type),
      { ignoreOriginalTarget: true, item: assetsIds, transacting }
    )
  ));

  return responses;
}

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
      [permissions, assetsIds] = handleOnlyShared({ permissions, assetsIds });
    }

    if (userSession && userSession?.userAgents) {
      [viewItems, editItems, assignItems] = await handleItemPermissions({ assetsIds, userAgents: userSession.userAgents, transacting });
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
