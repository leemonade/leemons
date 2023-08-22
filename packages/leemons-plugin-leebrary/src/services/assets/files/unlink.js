const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { tables } = require('../../tables');
const { normalizeItemsArray } = require('../../shared');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the user has permissions to delete the asset
 * @param {string} assetId - The ID of the asset
 * @param {object} userSession - The user session object
 * @param {object} transacting - The transaction object
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the user has delete permissions
 */
async function checkPermissions(assetId, { userSession, transacting } = {}) {
  const { permissions } = await getPermissions(assetId, { userSession, transacting });
  if (!permissions.delete) {
    throw new global.utils.HttpError(401, "You don't have permissions to delete this asset");
  }
  return true;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Unlink files from an asset
 * @param {Array|string} fileIds - The IDs of the files
 * @param {string} assetId - The ID of the asset
 * @param {object} options - The options object
 * @returns {Promise<boolean>} - Returns a promise that resolves to a boolean indicating if the files were successfully unlinked
 */
async function unlink(fileIds, assetId, { userSession, soft, transacting } = {}) {
  try {
    await checkPermissions(assetId, { userSession, transacting });

    const ids = normalizeItemsArray(fileIds);
    const query = {
      file_$in: ids,
    };

    if (assetId) {
      query.asset = assetId;
    }

    const deleted = await tables.assetsFiles.deleteMany(query, { soft, transacting });

    return deleted.count > 0;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to delete file: ${e.message}`);
  }
}

module.exports = { unlink };
