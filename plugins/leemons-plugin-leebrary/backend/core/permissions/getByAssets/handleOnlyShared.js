const { forEach, difference } = require('lodash');
const getAssetIdFromPermissionName = require('../helpers/getAssetIdFromPermissionName');
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

module.exports = { handleOnlyShared };
