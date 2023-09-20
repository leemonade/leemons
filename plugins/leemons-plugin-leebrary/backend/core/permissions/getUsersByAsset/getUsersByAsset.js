const { LeemonsError } = require('@leemons/error');
const { getByAsset } = require('../getByAsset');
const getAssetPermissionName = require('../helpers/getAssetPermissionName');

/**
 * Gets users by asset.
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @throws {LeemonsError} If the user does not have view permission at least or if there is a failure in getting permissions.
 * @returns {Promise<Object>} The users with permissions.
 */
async function getUsersByAsset({ assetId, ctx }) {
  try {
    const { permissions } = await getByAsset({ assetId, ctx });

    // If user has at least VIEW permission
    if (permissions.view) {
      return ctx.tx.call('users.permissions.findUsersWithPermissions', {
        permissions: { permissionName: getAssetPermissionName({ assetId, ctx }) },
      });
    }

    throw new LeemonsError(ctx, {
      message: "You don't have permission to list users",
      httpStatusCode: 401,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: e.message === "You don't have permission to list users" ? 401 : 500,
    });
  }
}

module.exports = { getUsersByAsset };
