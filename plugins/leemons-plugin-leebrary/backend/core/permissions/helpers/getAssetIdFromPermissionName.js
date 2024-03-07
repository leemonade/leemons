const { last } = require('lodash');
const { permissionSeparator } = require('../../../config/constants');

/**
 * Extracts the asset ID from a permission name.
 *
 * @param {string} permissionName - The name of the permission from which to extract the asset ID.
 * @returns {string} - The extracted asset ID.
 */
function getAssetIdFromPermissionName(permissionName) {
  return last(permissionName.split(permissionSeparator));
}

module.exports = getAssetIdFromPermissionName;
