const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');
const { remove: removeFiles } = require('../files/remove');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Checks if the bookmark exists and throws an error if it doesn't
 * @param {number} assetId - The ID of the asset
 * @param {object} options - The options object
 * @param {object} options.transacting - The transaction object
 * @returns {object} - The bookmark object
 * @throws {HttpError} - Throws an error if the bookmark is not found
 */
async function checkBookmarkExists(assetId, { transacting }) {
  const bookmark = await getByAsset(assetId, { transacting });
  if (!bookmark) {
    throw new global.utils.HttpError(404, 'Bookmark not found');
  }
  return bookmark;
}

/**
 * Deletes the bookmark and its associated files
 * @param {object} bookmark - The bookmark object
 * @param {object} options - The options object
 * @param {boolean} options.soft - The soft delete flag
 * @param {object} options.userSession - The user session object
 * @param {object} options.transacting - The transaction object
 * @returns {object} - The deleted bookmark object
 * @throws {HttpError} - Throws an error if the deletion fails
 */
async function deleteBookmarkAndFiles(bookmark, { soft, userSession, transacting }) {
  try {
    const deleted = await tables.bookmarks.delete({ id: bookmark.id }, { soft, transacting });
    if (!isEmpty(bookmark.icon)) {
      await removeFiles(bookmark.icon, assetId, { userSession, soft, transacting });
    }
    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove bookmark: ${e.message}`);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Removes a bookmark
 * @param {number} assetId - The ID of the asset
 * @param {object} options - The options object
 * @param {boolean} options.soft - The soft delete flag
 * @param {object} options.userSession - The user session object
 * @param {object} options.transacting - The transaction object
 * @returns {object} - The deleted bookmark object
 * @throws {HttpError} - Throws an error if the bookmark is not found or the deletion fails
 */
async function remove(assetId, { soft, userSession, transacting } = {}) {
  const bookmark = await checkBookmarkExists(assetId, { transacting });
  return deleteBookmarkAndFiles(bookmark, { soft, userSession, transacting });
}

module.exports = { remove };
