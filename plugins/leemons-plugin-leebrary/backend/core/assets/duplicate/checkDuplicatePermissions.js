const { LeemonsError } = require('@leemons/error');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
/**
 * Checks if the user has permissions to duplicate the asset. If the user doesn't have permissions, it throws a LeemonsError.
 *
 * @async
 * @function
 * @param {object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context containing the user session and other context data.
 * @returns {Promise<boolean>} - Returns true if the user has permissions to duplicate the asset.
 * @throws {LeemonsError} - Throws a LeemonsError with HTTP status code 401 if the user doesn't have permissions to duplicate the asset.
 */
async function checkDuplicatePermissions({ assetId, ctx }) {
  const { permissions } = await getPermissions({ assetId, ctx });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.duplicate) {
    throw new LeemonsError(ctx, {
      message: "You don't have permissions to duplicate this asset",
      httpStatusCode: 401,
    });
  }
  return true;
}

module.exports = { checkDuplicatePermissions };
