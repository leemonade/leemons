const { getByAsset } = require('./getByAsset');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');

async function getUsersByAsset(assetId, { userSession, transacting } = {}) {
  try {
    const { permissions } = await getByAsset(assetId, { userSession, transacting });

    // If user has at least VIEW permission
    if (permissions.view) {
      const { services } = leemons.getPlugin('users');
      const users = await services.permissions.findUsersWithPermissions({
        permissionName: getAssetPermissionName(assetId),
      });
      return users;
    }

    throw new global.utils.HttpError(401, "You don't have permission to list users");
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getUsersByAsset };
