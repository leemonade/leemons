const { map, forEach } = require('lodash');
/**
 * Fetches permissions for each asset and checks if the user can edit permissions
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch permissions for
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Array>} - Returns an array containing permissions by asset and canEditPermissions
 */
async function getUserPermissionsByAsset({ assets, ctx }) {
  let canEditPermissions = [];
  let canAdminPermissions = [];

  const [viewPerms, editPerms, assignPerms, adminPerms] = await Promise.all([
    // eslint-disable-next-line sonarjs/no-duplicate-string
    ctx.tx.call('users.permissions.getItemPermissions', {
      item: map(assets, 'id'),
      type: ctx.prefixPN('asset.can-view'),
      returnRaw: true,
    }),
    ctx.tx.call('users.permissions.getItemPermissions', {
      item: map(assets, 'id'),
      type: ctx.prefixPN('asset.can-edit'),
      returnRaw: true,
    }),
    ctx.tx.call('users.permissions.getItemPermissions', {
      item: map(assets, 'id'),
      type: ctx.prefixPN('asset.can-assign'),
      returnRaw: true,
    }),
    ctx.tx.call('users.permissions.getItemPermissions', {
      item: map(assets, 'id'),
      type: ctx.prefixPN('asset.can-administer'),
      returnRaw: true,
    }),
  ]);

  if (ctx.meta.userSession) {
    canEditPermissions = await ctx.tx.call(
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType',
      {
        userAgentId: ctx.meta.userSession.userAgents,
        type: ctx.prefixPN('asset.can-edit'),
        ignoreOriginalTarget: true,
        item: map(assets, 'id'),
      }
    );
    canAdminPermissions = await ctx.tx.call(
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType',
      {
        userAgentId: ctx.meta.userSession.userAgents,
        type: ctx.prefixPN('asset.can-administer'),
        ignoreOriginalTarget: true,
        item: map(assets, 'id'),
      }
    );
  }

  const currentPermissions = [...viewPerms, ...editPerms, ...assignPerms, ...adminPerms];

  const permissionsByAsset = {};
  forEach(currentPermissions, (permission) => {
    if (!permissionsByAsset[permission.item]) {
      permissionsByAsset[permission.item] = {
        viewer: [],
        editor: [],
        assigner: [],
        admin: [],
      };
    }
    let role = 'viewer';
    if (permission.type.includes('can-edit')) {
      role = 'editor';
    } else if (permission.type.includes('can-assign')) {
      role = 'assigner';
    } else if (permission.type.includes('can-administer')) {
      role = 'admin';
    }
    permissionsByAsset[permission.item][role].push(permission.permissionName);
  });

  return [permissionsByAsset, canEditPermissions, canAdminPermissions];
}
module.exports = { getUserPermissionsByAsset };
