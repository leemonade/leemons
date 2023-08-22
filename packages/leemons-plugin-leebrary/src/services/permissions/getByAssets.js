const { flattenDeep, forEach, findIndex, difference } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

/**
 * Asynchronously gets user permissions for given assets.
 *
 * @async
 * @param {Object} params - The parameters.
 * @param {Array} params.assetsIds - An array of asset IDs.
 * @param {Object} params.userSession - The user session object.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} An array of responses from the user service.
 */
async function getUserPermissions({ assetsIds, userSession, transacting }) {
  const { services: userService } = leemons.getPlugin('users');
  const permissionTypes = ['asset.can-view', 'asset.can-edit', 'asset.can-assign'];

  const responses = await Promise.all(permissionTypes.map(type =>
    userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
      userSession.userAgents,
      leemons.plugin.prefixPN(type),
      { ignoreOriginalTarget: true, item: assetsIds, transacting }
    )
  ));

  return responses;
}

/**
 * Processes final permissions for assets.
 *
 * @param {Object} params - The parameters.
 * @param {Array} params.assetPermissions - An array of asset permissions.
 * @param {Array} params.viewItems - An array of view items.
 * @param {Array} params.assignItems - An array of assign items.
 * @param {Array} params.editItems - An array of edit items.
 * @returns {Array} An array of final asset permissions.
 */
function processFinalPermissions({ assetPermissions, viewItems, assignItems, editItems }) {
  const processItems = (items, role) => {
    forEach(items, (asset) => {
      const index = findIndex(assetPermissions, { asset });
      if (index >= 0 && assetPermissions[index].role === 'viewer') {
        assetPermissions[index].role = role;
        assetPermissions[index].permissions = getRolePermissions(role);
      } else if (index < 0) {
        assetPermissions.push({
          asset,
          role,
          permissions: getRolePermissions(role),
        });
      }
    });
  };

  processItems(viewItems, 'viewer');
  processItems(assignItems, 'assigner');
  processItems(editItems, 'editor');

  return assetPermissions;
}

/**
 * Asynchronously gets permissions by assets.
 *
 * @async
 * @param {Array} assetIds - An array of asset IDs.
 * @param {Object} options - An object containing various options.
 * @param {boolean} options.showPublic - Whether to show public assets.
 * @param {Object} options.userSession - The user session object.
 * @param {boolean} options.onlyShared - Whether to only show shared assets.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Array} An array of objects each containing the asset ID, role and permissions.
 * @throws {HttpError} Throws an HTTP error if unable to get permissions.
 */
async function getByAssets(assetIds, { showPublic, userSession, onlyShared, transacting } = {}) {
  // Flatten the assetIds array to ensure it's one-dimensional
  let assetsIds = flattenDeep([assetIds]);

  try {
    // Get the user service from the leemons plugin
    const { services: userService } = leemons.getPlugin('users');

    // Initialize permissions and items arrays
    let permissions = [];
    let viewItems = [];
    let editItems = [];
    let assignItems = [];

    // If userSession and userAgents exist, get user agent permissions
    if (userSession && userSession?.userAgents) {
      permissions = await userService.permissions.getUserAgentPermissions(userSession.userAgents, {
        query: {
          // Map over assetIds to create a query for each assetId
          $or: assetsIds.map((id) => ({ permissionName_$contains: getAssetPermissionName(id) })),
        },
        transacting,
      });
    }

    // If onlyShared is true, filter out owner permissions and update assetsIds
    if (onlyShared) {
      const ownerAssetIds = [];
      const newPermissions = [];
      forEach(permissions, (item) => {
        // If the action name includes 'owner', add the assetId to assetIdsOwner
        if (item.actionNames.includes('owner')) {
          ownerAssetIds.push(getAssetIdFromPermissionName(item.permissionName));
        } else {
          // Otherwise, add the item to newPermissions
          newPermissions.push(item);
        }
      });
      // Update permissions and assetsIds
      permissions = newPermissions;
      assetsIds = difference(assetsIds, ownerAssetIds);
    }

    // If userSession and userAgents exist, get all items for the user agent that have permissions by type
    if (userSession && userSession?.userAgents) {
      // Destructure responses into viewItems, editItems, and assignItems
      [viewItems, editItems, assignItems] = await getUserPermissions({ assetsIds, userSession, transacting });
    }

    // ··········································
    // PUBLIC ASSETS

    // If showPublic is true, find all public assets
    const publicAssets = showPublic
      ? await tables.assets.find(
        { id_$in: assetsIds, public: true },
        { columns: ['id', 'public'], transacting }
      )
      : [];

    // ··········································
    // RESULTS ARRAY

    // Map over permissions and publicAssets to create results array
    const assetPermissions = [...permissions, ...publicAssets].map((item) => ({
      asset: item.public ? item.id : getAssetIdFromPermissionName(item.permissionName),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions(item.public ? 'public' : item.actionNames[0]),
    }));

    // ··········································
    // PREPARE RESULTS WITH ADDITIONAL ITEMS

    const result = processFinalPermissions({ assetPermissions, viewItems, assignItems, editItems });

    // Return the results array
    return result;
  } catch (e) {
    // Log the error and throw an HTTP error
    console.error(e);
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAssets };
