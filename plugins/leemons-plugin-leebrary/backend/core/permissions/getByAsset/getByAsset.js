const { find, isEmpty } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const getRolePermissions = require('../helpers/getRolePermissions');
const getAssetPermissionName = require('../helpers/getAssetPermissionName');

/**
 * Retrieves permissions by asset.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise} A promise that resolves with the permissions.
 */

async function getByAsset({ assetId, ctx }) {
  try {
    const { userSession } = ctx.meta;
    const getAllItemsForTheUserAgentHasPermissionsByType =
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType';

    const [permissions, canView, canEdit, canAssign] = await Promise.all([
      ctx.tx.call('users.permissions.getUserAgentPermissions', {
        userAgent: userSession.userAgents,
        query: { permissionName: getAssetPermissionName({ assetId, ctx }) },
      }),
      ctx.tx.call(getAllItemsForTheUserAgentHasPermissionsByType, {
        userAgentId: userSession.userAgents.map((userAgent) => userAgent.id),
        type: ctx.prefixPN('asset.can-view'),
        ignoreOriginalTarget: true,
        item: assetId,
      }),
      ctx.tx.call(getAllItemsForTheUserAgentHasPermissionsByType, {
        userAgentId: userSession.userAgents.map((userAgent) => userAgent.id),
        type: ctx.prefixPN('asset.can-edit'),
        ignoreOriginalTarget: true,
        item: assetId,
      }),
      ctx.tx.call(getAllItemsForTheUserAgentHasPermissionsByType, {
        userAgentId: userSession.userAgents.map((userAgent) => userAgent.id),
        type: ctx.prefixPN('asset.can-assign'),
        ignoreOriginalTarget: true,
        item: assetId,
      }),
    ]);

    let role = null;

    if (isEmpty(permissions)) {
      const asset = await ctx.tx.db.Assets.findOne({ id: assetId }).select(['id', 'public']).lean();
      if (asset?.public) {
        role = 'public';
      }
    }

    const permission = find(
      permissions,
      (item) => item.permissionName.indexOf(assetId) > -1 // 'plugins.leebrary.23ee5f1b-9e71-4a39-9ddf-db472c7cdefd',
    );

    role = role ?? permission?.actionNames[0];

    const canAccessRole = role;

    if (canView?.length && !role) {
      role = 'viewer';
    }
    if (canAssign?.length && (!role || role !== 'owner')) {
      role = 'assigner';
    }
    if (canEdit?.length && (!role || role !== 'owner')) {
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
