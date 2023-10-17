const getRolePermissions = require('../helpers/getRolePermissions');
const getAssetIdFromPermissionName = require('../helpers/getAssetIdFromPermissionName');

/**
 * This function handles the permissions roles.
 * It maps and filters the permissions based on the roles and assetIds.
 *
 * @param {Object} params - An object containing the following properties:
 * @param {Array} params.permissions - An array of permissions to be handled.
 * @param {Array} params.roles - An array of roles to be checked against.
 * @param {Array} params.assetIds - An array of asset IDs to be checked against.
 * @param {MoleculerContext} params.ctx - An object representing the context of the request.
 * @returns {Array} - Returns an array of permissions after mapping and filtering.
 */
function handlePermissionsRoles({ permissions, roles, assetIds, ctx }) {
  return permissions
    .map((item) => ({
      asset: getAssetIdFromPermissionName(item.permissionName),
      role: item.actionNames[0],
      permissions: getRolePermissions({ role: item.actionNames[0], ctx }),
    }))
    .filter((item) => {
      if (roles?.length && !roles.includes(item.role)) {
        return false;
      }
      return assetIds.includes(item.asset);
    });
}

module.exports = { handlePermissionsRoles };
