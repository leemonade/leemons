const { exists: fileExists } = require('../../files/exists');
const { exists: assetExists } = require('../exists');
const { tables } = require('../../tables');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the user has permissions to update the asset
 * 
 * @param {object} params - The params object
 * @param {string} params.assetId - The ID of the asset to check
 * @param {object} params.userSession - The user session object
 * @param {object} params.transacting - The transaction object
 * @param {boolean} params.skipPermissions - Flag to skip permission check
 * @returns {Promise<void>} - Throws an error if the user doesn't have permissions
 */
async function checkPermissions({ assetId, skipPermissions, userSession, transacting }) {
  // EN: Get the user permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.edit && !skipPermissions) {
    throw new global.utils.HttpError(401, "You don't have permissions to update this asset");
  }
}

/**
 * Check if the file and asset exist in the database
 * 
 * @param {object} params - The params object
 * @param {string} params.fileId - The ID of the file to check
 * @param {string} params.assetId - The ID of the asset to check
 * @param {object} params.transacting - The transaction object
 * @returns {Promise<void>} - Throws an error if the file or asset doesn't exist
 */
async function checkExistence({ fileId, assetId, transacting }) {
  if (!(await fileExists(fileId, { transacting }))) {
    console.log('ERROR fileId:', fileId);
    throw new global.utils.HttpError(422, 'File not found');
  }

  if (!(await assetExists(assetId, { transacting }))) {
    throw new global.utils.HttpError(422, 'Asset not found');
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Add a file to an asset
 * 
 * @param {string} fileId - The ID of the file to add
 * @param {string} assetId - The ID of the asset to add the file to
 * @param {object} options - The options object
 * @param {boolean} options.skipPermissions - Flag to skip permission check
 * @param {object} options.userSession - The user session object
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<object>} - Returns the updated asset
 */
async function add(fileId, assetId, { skipPermissions, userSession, transacting } = {}) {
  try {
    await checkPermissions({ assetId, userSession, transacting, skipPermissions });
    await checkExistence({ fileId, assetId, transacting });

    return tables.assetsFiles.set(
      { asset: assetId, file: fileId },
      { asset: assetId, file: fileId },
      { transacting }
    );
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to add file: ${e.message}`);
  }
}

module.exports = { add };
