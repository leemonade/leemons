const { LeemonsError } = require('leemons-error');
const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');
/**
 * Validates the user's permissions to update the asset
 *
 * @param {object} params - The parameters object
 * @param {string} params.assetId - The unique identifier of the asset to validate
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @param {boolean} params.skipPermissions - Flag to bypass permission check
 * @returns {Promise<void>} - Resolves to void if the user has permissions, otherwise throws an error
 */
async function handlePermissions({ assetId, skipPermissions, ctx }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions({ assetId, ctx });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions?.edit && !skipPermissions)
    throw new LeemonsError(ctx, {
      message: "You don't have permissions to update this asset",
      httpStatusCode: 401,
    });
}

module.exports = { handlePermissions };
