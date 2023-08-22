const { getByAsset } = require('./getByAsset');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches permissions for a given asset.
 * 
 * @param {string} assetId - The ID of the asset
 * @param {Object} options - An object containing userSession and transacting properties
 * @returns {Promise<Object>} - An object containing permissions
 */
async function fetchPermissionsByAsset(assetId, { userSession, transacting }) {
  const { permissions } = await getByAsset(assetId, { userSession, transacting });
  return permissions;
}

/**
 * Fetches users with at least VIEW permission for a given asset.
 * 
 * @param {string} assetId - The ID of the asset
 * @returns {Promise<Array>} - An array of users with at least VIEW permission
 */
async function fetchUsersWithViewPermission(assetId) {
  const { services } = leemons.getPlugin('users');
  const users = await services.permissions.findUsersWithPermissions({
    permissionName: getAssetPermissionName(assetId),
  });
  return users;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches permissions for a given asset and returns users with at least VIEW permission.
 * Throws an error if the user doesn't have permission to list users or if there's a failure in getting permissions.
 * 
 * @param {string} assetId - The ID of the asset
 * @param {Object} options - An object containing userSession and transacting properties
 * @param {Object} options.userSession - The user's session
 * @param {Object} options.transacting - The transaction object
 * @returns {Promise<Array>} - An array of users with at least VIEW permission
 * @throws {HttpError} - Throws an error if the user doesn't have permission to list users or if there's a failure in getting permissions
 */
async function getUsersByAsset(assetId, { userSession, transacting } = {}) {
  try {
    const permissions = await fetchPermissionsByAsset(assetId, { userSession, transacting });

    if (permissions.view) {
      return await fetchUsersWithViewPermission(assetId);
    }

    throw new global.utils.HttpError(401, "You don't have permission to list users");
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}


module.exports = { getUsersByAsset };
