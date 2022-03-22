const { find, isEmpty, last } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');

async function getByAsset(assetId, { userSession, transacting } = {}) {
  try {
    const { services: userService } = leemons.getPlugin('users');
    const permissions = await userService.permissions.getUserAgentPermissions(
      userSession.userAgents,
      {
        query: { permissionName: leemons.plugin.prefixPN(assetId) },
        transacting,
      }
    );

    if (isEmpty(permissions)) {
      const asset = await tables.assets.find(
        { id: assetId },
        { columns: ['id', 'public'], transacting }
      );
      if (asset[0]?.public) {
        return {
          role: 'public',
          permissions: getRolePermissions('public'),
        };
      }
    }

    const permission = find(
      permissions,
      (item) => assetId === last(item.permissionName.split('.')) // 'plugins.leebrary.23ee5f1b-9e71-4a39-9ddf-db472c7cdefd',
    );

    const role = permission?.actionNames[0];

    return { role, permissions: getRolePermissions(role) };
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAsset };
