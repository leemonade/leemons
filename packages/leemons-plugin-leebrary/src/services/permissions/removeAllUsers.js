const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the user has permission to delete
 * @param {Object} permissions - The permissions object
 * @throws {HttpError} If the user does not have permission to delete
 */
function checkDeletePermission(permissions) {
  if (!permissions.delete) {
    throw new global.utils.HttpError(401, "You don't have permission to remove this role");
  }
}

/**
 * Delete all users from the asset
 * @param {string} assetId - The id of the asset
 * @param {Object} transacting - The transaction object
 * @returns {Promise} A promise that resolves when the users are deleted
 * @throws {HttpError} If there is an error during deletion
 */
async function deleteAllUsers(assetId, transacting) {
  try {
    return await tables.permissions.deleteMany(
      {
        asset: assetId,
      },
      { transacting }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete role: ${e.message}`);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Remove all users from an asset
 * @param {string} assetId - The id of the asset
 * @param {Object} options - The options object
 * @param {Object} options.userSession - The user session object
 * @param {Object} options.transacting - The transaction object
 * @returns {Promise} A promise that resolves when the users are removed
 * @throws {HttpError} If there is an error during removal
 */
async function removeAllUsers(assetId, { userSession, transacting } = {}) {
  try {
    // EN: Get user role
    // ES: Obtener rol del usuario
    const { permissions } = await getByAsset(assetId, { userSession, transacting });

    checkDeletePermission(permissions);

    // EN: Remove all the users
    // ES: Eliminar todos los usuarios
    return await deleteAllUsers(assetId, transacting);
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete role: ${e.message}`);
  }
}

module.exports = { removeAllUsers };
