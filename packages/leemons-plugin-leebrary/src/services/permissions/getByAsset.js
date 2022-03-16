const { find, isEmpty } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');

async function getByAsset(assetId, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    console.log('--- Vamos a pillar los permisos ---');
    console.log('permissionName:', leemons.plugin.prefixPN(assetId));

    const { services: userService } = leemons.getPlugin('users');
    const permissions = await userService.permissions.getUserAgentPermissions(
      userSession.userAgents,
      {
        query: { permissionName: leemons.plugin.prefixPN(assetId) },
        transacting,
      }
    );
    // leemons.plugin.prefixPN('asset'),
    console.dir(permissions, { depth: null });

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

    // const actions = item.actionNames; // ['view'],
    /*
    const [permission] = await tables.permissions.find(
      {
        asset: assetId,
        userAgent,
      },
      { transacting }
    );
    */

    const permission = find(permissions, (item) => {
      console.log('permission:', item);
      const id = item.permissionName.split('.').at(-1); // 'plugins.media-library.files.archivo1',
      console.log('permission assetId:', id);
      return id === assetId;
    });

    const role = permission?.actionNames[0];

    return { role, permissions: getRolePermissions(role) };
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAsset };
