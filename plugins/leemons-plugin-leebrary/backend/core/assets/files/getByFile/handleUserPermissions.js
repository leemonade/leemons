const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');
/**
 * Checks if the user has permissions to view the asset.
 *
 * @param {object} params - The options object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has permissions.
 */
async function handleUserPermissions({ assetId, ctx }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions({ assetId, ctx });

  // EN: Check if the user has permissions to view the asset
  // ES: Comprobar si el usuario tiene permisos para ver el asset
  return permissions.view;
}
module.exports = { handleUserPermissions };
