const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');
/**
 * Checks if the user has permissions to delete the asset.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Moleculer} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has delete permissions.
 */
async function handleUserPermissions({ assetId, ctx }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions({ assetId, ctx });

  // EN: Check if the user has permissions to delete the asset
  // ES: Comprobar si el usuario tiene permisos para eliminar el asset
  return permissions.delete;
}

module.exports = { handleUserPermissions };
