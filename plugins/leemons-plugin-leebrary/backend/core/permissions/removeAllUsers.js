const { LeemonsError } = require('@leemons/error');
const { getByAsset } = require('./getByAsset');

/**
 * This function removes all users from a given asset.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.assetId - The ID of the asset from which to remove all users.
 * @param {MoleculerContext} params.ctx - The context object containing additional information.
 * @throws {LeemonsError} When the user does not have permission to remove the role, or when the role deletion fails.
 */
async function removeAllUsers({ assetId, ctx } = {}) {
  try {
    // EN: Get user role
    // ES: Obtener rol del usuario
    const { permissions } = await getByAsset({ assetId, ctx });

    if (!permissions.delete) {
      throw new LeemonsError(ctx, {
        message: "You don't have permission to remove this role",
        httpStatusCode: 401,
      });
    }
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to delete role: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { removeAllUsers };
