const { last, flattenDeep } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');

async function getByAssets(assetIds, { userSession, transacting } = {}) {
  const assetsIds = flattenDeep([assetIds]);

  try {
    const { services: userService } = leemons.getPlugin('users');
    const permissions = await userService.permissions.getUserAgentPermissions(
      userSession.userAgents,
      {
        query: {
          $or: assetsIds.map((id) => ({ permissionName_$contains: leemons.plugin.prefixPN(id) })),
        },
        transacting,
      }
    );

    const publicAssets = await tables.assets.find(
      { id_$in: assetsIds, public: true },
      { columns: ['id', 'public'], transacting }
    );

    return permissions.concat(publicAssets).map((item) => ({
      asset: item.public ? item.id : last(item.permissionName.split('.')),
      role: item.public ? 'public' : item.actionNames[0],
      permissions: getRolePermissions(item.public ? 'public' : item.actionNames[0]),
    }));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAssets };
