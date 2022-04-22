const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

async function getByCategory(categoryId, { userSession, transacting } = {}) {
  try {
    const { services: userService } = leemons.getPlugin('users');
    const permissions = await userService.permissions.getUserAgentPermissions(
      userSession.userAgents,
      {
        query: {
          permissionName_$startsWith: leemons.plugin.prefixPN(''),
          target: categoryId,
        },
        transacting,
      }
    );

    return permissions.map((item) => ({
      asset: getAssetIdFromPermissionName(item.permissionName),
      role: item.actionNames[0],
      permissions: getRolePermissions(item.actionNames[0]),
    }));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByCategory };
