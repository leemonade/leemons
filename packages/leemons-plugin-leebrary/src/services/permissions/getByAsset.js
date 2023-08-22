const { find, isEmpty } = require('lodash');
const { tables } = require('../tables');
const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');

/**
 * Gets permissions by asset ID.
 *
 * @async
 * @param {string} assetId - The asset ID.
 * @param {Object} options - The options.
 * @param {Object} options.userSession - The user session object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} An object containing the role, permissions and canAccessRole.
 * @throws {HttpError} Throws an HTTP error if unable to get permissions.
 */
async function getByAsset(assetId, { userSession, transacting } = {}) {
  try {
    const { services: userService } = leemons.getPlugin('users');
    const permissionTypes = ['asset.can-view', 'asset.can-edit', 'asset.can-assign'];

    const [permissions, ...permissionResponses] = await Promise.all([
      userService.permissions.getUserAgentPermissions(userSession.userAgents, {
        query: { permissionName: getAssetPermissionName(assetId) },
        transacting,
      }),
      ...permissionTypes.map(type =>
        userService.permissions.getAllItemsForTheUserAgentHasPermissionsByType(
          userSession.userAgents,
          leemons.plugin.prefixPN(type),
          { ignoreOriginalTarget: true, item: assetId, transacting }
        )
      ),
    ]);

    let role = null;

    if (isEmpty(permissions)) {
      const asset = await tables.assets.find(
        { id: assetId },
        { columns: ['id', 'public'], transacting }
      );
      if (asset[0]?.public) {
        role = 'public';
      }
    }

    const permission = find(
      permissions,
      (item) => item.permissionName.indexOf(assetId) > -1
    );

    role = role ?? permission?.actionNames[0];

    const canAccessRole = role;

    const roles = ['viewer', 'assigner', 'editor'];
    permissionResponses.forEach((response, index) => {
      if (response.length && (!role || role !== 'owner')) {
        role = roles[index];
      }
    });

    return { role, permissions: getRolePermissions(role), canAccessRole: canAccessRole || role };
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getByAsset };
