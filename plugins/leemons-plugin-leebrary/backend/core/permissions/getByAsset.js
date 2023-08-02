const { find, isEmpty } = require('lodash');
const { LeemonsError } = require('leemons-error');

const getRolePermissions = require('./helpers/getRolePermissions');
const getAssetPermissionName = require('./helpers/getAssetPermissionName');

/**
 * Retrieves permissions for an asset for a specific user.
 *
 * @param {Object} options - Input options.
 * @param {string} options.assetId - The ID of the asset to retrieve permissions for.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @param {Object} options.ctx.meta - Context metadata for the request.
 * @param {Object} options.ctx.meta.userSession - User session.
 * @returns {Promise<Object>} Object with information about the asset's permissions for the user.
 * @throws {LeemonsError} If fails to retrieve permissions.
 */
async function getByAsset({ assetId, ctx }) {
  try {
    const { userSession } = ctx.meta;
    // const { services: userService } = leemons.getPlugin('users');

    const [permissions, canView, canEdit] = await Promise.all([
      ctx.tx.call('users.permissions.getUserAgentPermissions', {
        userAgent: userSession.userAgents,
        query: { permissionName: getAssetPermissionName({ assetId, ctx }) },
        ctx,
      }),
      ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
        userAgentId: userSession.userAgents,
        type: leemons.plugin.prefixPN('asset.can-view'),
        ignoreOriginalTarget: true,
        item: assetId,
      }),
      ctx.tx.call('users.permissions.getAllItemsForTheUserAgentHasPermissionsByType', {
        userAgentId: userSession.userAgents,
        type: leemons.plugin.prefixPN('asset.can-edit'),
        ignoreOriginalTarget: true,
        item: assetId,
      }),
    ]);

    let role = null;

    if (isEmpty(permissions)) {
      const asset = await ctx.tx.db.Assets.find({ id: assetId }).select(['id', 'public']).lean();
      if (asset[0]?.public) {
        role = 'public';
      }
    }

    const permission = find(
      permissions,
      (item) => item.permissionName.indexOf(assetId) > -1 // 'leebrary.23ee5f1b-9e71-4a39-9ddf-db472c7cdefd',
    );

    role = role ?? permission?.actionNames[0];

    const canAccessRole = role;

    if (canView.length && !role) {
      role = 'viewer';
    }
    if (canEdit.length && (!role || role !== 'owner')) {
      role = 'editor';
    }

    return {
      role,
      permissions: getRolePermissions({ role, ctx }),
      canAccessRole: canAccessRole || role,
    };
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getByAsset };
