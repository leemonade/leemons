const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');

async function getByAsset(assetId, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    // const { services: userService } = leemons.getPlugin('users');
    // const permissions = await userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType();

    const [permission] = await tables.permissions.find(
      {
        asset: assetId,
        userAgent,
      },
      { transacting }
    );

    if (!permission) {
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

    return { role: permission?.role, permissions: getRolePermissions(permission?.role) };
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAsset };
