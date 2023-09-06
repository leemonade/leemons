/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { getByAsset: getBookmark } = require('../../bookmarks/getByAsset');
const { checkDuplicable: checkCategoryDuplicable } = require('../../categories/checkDuplicable');
const { duplicate: duplicateFile } = require('../../files/duplicate');
const { add: addFiles } = require('../files/add');
const { normalizeItemsArray } = require('../../shared');
const { CATEGORIES } = require('../../../config/constants');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');
const { getFileIds } = require('./getFileIds');
const { getFilesToDuplicate } = require('./getFilesToDuplicate');
const { handleTags } = require('./handleTags');
const { handleAssetDuplication } = require('./handleAssetDuplication');
const { handleCoverDuplication } = require('./handleCoverDuplication');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Handles the duplication of the bookmark associated with a given asset.
 * It duplicates the bookmark icon file and updates the new asset with the duplicated bookmark.
 *
 * @param {Object} params - An object containing the parameters
 * @param {Object} params.newAsset - The new asset object
 * @param {Object} params.bookmark - The bookmark object
 * @param {Array} params.filesToDuplicate - An array of file objects
 * @param {Object} params.transacting - The transaction object
 * @returns {Promise<Object>} - Returns a promise with the updated asset
 */
async function handleBookmarkDuplication({ newAsset, bookmark, filesToDuplicate, transacting }) {
  let newIconId = null;

  if (bookmark.icon) {
    const icon = _.find(filesToDuplicate, { id: bookmark.icon });
    const newIcon = await duplicateFile(icon, { transacting });
    newIconId = newIcon?.id;

    newAsset.url = bookmark.url;
    newAsset.icon = newIcon;
    newAsset.fileType = 'bookmark';
    newAsset.metadata = [];
  }

  await tables.bookmarks.create(
    { url: bookmark.url, asset: newAsset.id, icon: newIconId },
    { transacting }
  );

  return newAsset;
}

/**
 * Handles the duplication of files associated with a given asset.
 * It duplicates each file, excluding the cover, and updates the new asset with the duplicated files.
 * If the asset has a cover, it is added to the files array.
 * The function returns the updated asset.
 *
 * @param {Object} params - An object containing the parameters
 * @param {Array} params.filesToDuplicate - An array of file objects
 * @param {Object} params.cover - The cover file object
 * @param {Object} params.newAsset - The new asset object
 * @param {Object} params.category - The category object
 * @param {Object} params.userSession - The user session object
 * @param {Object} params.transacting - The transaction object
 * @returns {Promise<Object>} - Returns a promise with the updated asset
 */
async function handleFilesDuplication({
  filesToDuplicate,
  cover,
  newAsset,
  category,
  userSession,
  transacting,
}) {
  let newFiles = [];
  const isMediaFile = category.key === CATEGORIES.MEDIA_FILES;

  // EN: Duplicate all the files
  if (filesToDuplicate.length) {
    const toDuplicatePromises = [];

    _.forEach(filesToDuplicate, (file) => {
      toDuplicatePromises.push(duplicateFile(file, { transacting }));
    });

    newFiles = await Promise.all(toDuplicatePromises);
  }

  // EN: If the asset is a MediaFile, and has NO files, means it is an Image, and the cover is the file
  if (isMediaFile && _.isEmpty(newFiles) && cover?.id) {
    newFiles.push(cover);
  }

  // EN: Now, let's create the relation between the file and Asset
  const addFileToAssetPromises = [];
  _.forEach(newFiles, (file) => {
    addFileToAssetPromises.push(
      addFiles(file.id, newAsset.id, {
        skipPermissions: true,
        userSession,
        transacting,
      })
    );
  });

  await Promise.allSettled(addFileToAssetPromises);

  // If the new asset doesn't have a cover, assign the first file in the newFiles array to the newAsset.file
  if (!_.isEmpty(newFiles)) {
    if (!newAsset.cover) {
      [newAsset.file] = newFiles;
    }
  }

  return newAsset;
}

// ------------------------------------------------------------------------------------
// PUBLIC METHODS

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
  const { userSession } = ctx.meta;
  const pPermissions = normalizeItemsArray(permissions);

  await checkDuplicatePermissions({ assetId, ctx });

  const asset = await getAndCheckAsset({ assetId, ctx });
  const category = await checkCategoryDuplicable({ categoryId: asset.category, ctx });

  // EN: Store the IDs of files associated with the asset in order to track them
  const filesIds = await getFileIds({ asset, ctx });

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
      transacting,
    });
  } else {
    newAsset = await handleFilesDuplication({
      filesToDuplicate,
      cover: newAsset.cover,
      newAsset,
      category,
      userSession,
      transacting,
    });
  }

  return newAsset;
}

module.exports = { duplicate };
