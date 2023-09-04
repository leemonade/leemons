const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { remove } = require('./remove');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Checks if the user has permissions to delete the asset.
 * 
 * @param {Object} params - The parameters object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.userSession - The user session object.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has delete permissions.
 */
async function checkUserPermissions({ assetId, userSession, transacting }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to delete the asset
  // ES: Comprobar si el usuario tiene permisos para eliminar el asset
  return permissions.delete;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Unlinks files from an asset.
 * This function checks if the user has permissions to delete the asset, and if so, it removes the files from the asset.
 * 
 * @param {Array|string} fileIds - The IDs of the files to be unlinked.
 * @param {string} assetId - The ID of the asset from which files are to be unlinked.
 * @param {Object} options - The options object.
 * @param {Object} options.userSession - The user session object.
 * @param {boolean} options.soft - Whether to perform a soft delete. Default is false.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the files were successfully unlinked from the asset.
 */
async function unlink(fileIds, assetId, { userSession, soft, transacting } = {}) {
  try {
    const hasPermissions = await checkUserPermissions({ assetId, userSession, transacting });
    if (!hasPermissions) {
      throw new global.utils.HttpError(401, "You don't have permissions to delete this asset");
    }

    return remove(fileIds, assetId, { soft, transacting });
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete file: ${e.message}`);
  }
}

module.exports = { unlink };
