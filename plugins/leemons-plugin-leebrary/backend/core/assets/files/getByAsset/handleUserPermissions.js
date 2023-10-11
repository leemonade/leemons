const { getByAsset: getPermissions } = require('../../../permissions/getByAsset');

/**
 * Check if the user has permissions to view the asset
 *
 * @param {object} options - The params object
 * @param {string} options.assetId - The ID of the asset to check
 * @param {MoleculerContext} options.ctx - The Moleculer context
 * @returns {Promise<boolean>} - Returns true if the user has view permissions, false otherwise
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
