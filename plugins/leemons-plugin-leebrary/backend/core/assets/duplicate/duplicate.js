/* eslint-disable no-param-reassign */
const { getByAsset: getBookmark } = require('../../bookmarks/getByAsset');
const { checkDuplicable: checkCategoryDuplicable } = require('../../categories/checkDuplicable');
const { normalizeItemsArray } = require('../../shared');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');
const { getFileIds } = require('./getFileIds');
const { getFilesToDuplicate } = require('./getFilesToDuplicate');
const { handleTags } = require('./handleTags');
const { handleAssetDuplication } = require('./handleAssetDuplication');
const { handleCoverDuplication } = require('./handleCoverDuplication');
const { handleBookmarkDuplication } = require('./handleBookmarkDuplication');
const { handleFilesDuplication } = require('./handleFilesDuplication');

/**
 * Duplicates an asset by creating a new asset with the same properties and associated files, cover, and bookmark.
 * The function takes an asset ID and an options object as parameters, and returns a promise that resolves to the duplicated asset.
 * If the operation fails, it throws an HTTP error.
 *
 * @param {string} assetId - The ID of the asset to duplicate
 * @param {object} options - The options object
 * @param {boolean} options.preserveName - A flag indicating whether to preserve the original asset name
 * @param {string} options.newId - The ID for the new asset
 * @param {boolean} options.indexable - A flag indicating whether the asset is indexable
 * @param {boolean} options.public - A flag indicating whether the asset is public
 * @param {object} options.userSession - The user session object
 * @param {Array} options.permissions - An array of permissions associated with the asset
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise that resolves to the duplicated asset
 * @throws {HttpError} - Throws an HTTP error if the operation fails
 */
async function duplicate({
  assetId,
  preserveName = false,
  newId,
  indexable,
  public: isPublic,
  permissions,
  ctx,
}) {
  const pPermissions = normalizeItemsArray(permissions);

  await checkDuplicatePermissions({ assetId, ctx });

  const asset = await getAndCheckAsset({ assetId, ctx });
  const category = await checkCategoryDuplicable({ categoryId: asset.category, ctx });

  // EN: Store the IDs of files associated with the asset in order to track them
  const filesIds = await getFileIds({ asset: { ...asset }, ctx });

  // ·········································································
  // HANDLE BOOKMARK

  // ES: En caso de que el asset sea un Bookmark, entonces recuperamos los datos
  // EN: In case the asset is a Bookmark, then we recover the data

  const bookmark = await getBookmark({ assetId, ctx });

  if (bookmark) {
    asset.fileType = 'bookmark';
    asset.metadata = [];

    if (bookmark.icon) {
      filesIds.push(bookmark.icon);
    }
  }

  // ·········································································
  // HANDLE FILES

  // eslint-disable-next-line prefer-const
  let { filesToDuplicate, cover } = await getFilesToDuplicate({
    filesIds,
    coverId: asset.cover,
    ctx,
  });

  // ·········································································
  // TAGS

  const tags = await handleTags({ assetId, ctx });

  // ·········································································
  // ASSET DUPLICATION

  let newAsset = await handleAssetDuplication({
    asset,
    tags,
    newId,
    preserveName,
    permissions: pPermissions,
    isIndexable: indexable,
    isPublic,
    ctx,
  });

  // ·········································································
  // POST DUPLICATION

  if (cover) {
    newAsset = await handleCoverDuplication({ newAsset, cover, ctx });
    // Remove the old cover from files to be duplicated
    filesToDuplicate = filesToDuplicate.filter((file) => file.id !== cover.id);
  }

  if (bookmark) {
    newAsset = await handleBookmarkDuplication({
      newAsset,
      bookmark,
      filesToDuplicate,
      ctx,
    });
  } else {
    newAsset = await handleFilesDuplication({
      newAsset,
      cover: newAsset.cover,
      filesToDuplicate,
      category,
      ctx,
    });
  }

  return newAsset;
}

module.exports = { duplicate };
