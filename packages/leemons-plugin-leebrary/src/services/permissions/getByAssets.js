const { flattenDeep } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');
const getAssetIdFromPermissionName = require('./helpers/getAssetIdFromPermissionName');

async function getByAssets(assetIds, { showPublic, userSession, transacting } = {}) {
  const assetsIds = flattenDeep([assetIds]);

  try {
    const { services: userService } = leemons.getPlugin('users');
    let permissions = [];
    if (userSession && userSession?.userAgents) {
      permissions = await userService.permissions.getUserAgentPermissions(userSession.userAgents, {
        query: {
          $or: assetsIds.map((id) => ({ permissionName_$contains: getAssetPermissionName(id) })),
        },
        transacting,
      });
    }

    const publicAssets = showPublic
      ? await tables.assets.find(
          { id_$in: assetsIds, public: true },
          { columns: ['id', 'public'], transacting }
        )
      : [];

    return permissions.concat(publicAssets).map((item) => ({
      asset: item.public ? item.id : getAssetIdFromPermissionName(item.permissionName),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions(item.public ? 'public' : item.actionNames[0]),
    }));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAssets };
