const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { tables } = require('../../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the user has permissions to view the asset
 * 
 * @param {object} options - The params object
 * @param {string} params.assetId - The ID of the asset to check
 * @param {object} params.userSession - The user's session object
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<boolean>} - Returns true if the user has view permissions, false otherwise
 */
async function checkUserPermissions({ assetId, userSession, transacting }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to view the asset
  // ES: Comprobar si el usuario tiene permisos para ver el asset
  return permissions.view;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Get the files associated with an asset if the user has view permissions
 * 
 * @param {string} assetId - The ID of the asset to check
 * @param {object} options - The options object
 * @param {object} options.userSession - The user's session object
 * @param {boolean} options.checkPermissions - Flag to check permissions
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array|void>} - Returns an array of files if the user has view permissions, void otherwise
 */
async function getByAsset(assetId, { userSession, checkPermissions = true, transacting } = {}) {
  try {
    if (checkPermissions) {
      const hasPermissions = await checkUserPermissions(assetId, userSession, transacting);
      if (!hasPermissions) {
        return [];
      }
    }

    return tables.assetsFiles
      .find({ asset: assetId }, { transacting })
      .then((files) => files.map((file) => file.file));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get files: ${e.message}`);
  }
}

module.exports = { getByAsset };
