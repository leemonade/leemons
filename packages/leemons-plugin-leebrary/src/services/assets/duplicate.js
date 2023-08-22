const _ = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { getByAsset: getBookmark } = require('../bookmarks/getByAsset');
const { add } = require('./add');
const { getById: getAsset } = require('./getById');
const { getById: getCategory } = require('../categories/getById');
const { duplicate: duplicateFile } = require('../files/duplicate');
const { tables } = require('../tables');
const { add: addFiles } = require('./files/add');
const { normalizeItemsArray, isTruthy } = require('../shared');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Check if the user has permissions to duplicate the asset
 * @param {string} assetId - The ID of the asset
 * @param {object} userSession - The user session object
 * @param {object} transacting - The transaction object
 * @throws {HttpError} - Throws an HTTP error if the user doesn't have permissions
 */
async function checkDuplicatePermissions(assetId, { userSession, transacting }) {
  const { permissions } = await getPermissions(assetId, { userSession, transacting });
  if (!permissions.duplicate) {
    throw new global.utils.HttpError(401, "You don't have permissions to duplicate this asset");
  }
}

/**
 * Get asset by ID
 * @param {string} assetId - The ID of the asset
 * @param {object} transacting - The transaction object
 * @returns {object} - Returns the asset object
 * @throws {HttpError} - Throws an HTTP error if the asset is not found
 */
async function getAssetById(assetId, { transacting }) {
  const asset = await getAsset(assetId, { transacting });
  if (!asset) throw new global.utils.HttpError(422, 'Asset not found');
  return asset;
}

/**
 * Check if the category of the asset is duplicable
 * @param {object} asset - The asset object
 * @param {object} transacting - The transaction object
 * @throws {HttpError} - Throws an HTTP error if the category is not duplicable
 */
async function checkCategoryDuplicable(asset, { transacting }) {
  const category = await getCategory(asset.category, { transacting });
  if (!category?.duplicable) {
    throw new global.utils.HttpError(401, 'Assets in this category cannot be duplicated');
  }
}

/**
 * Get file IDs
 * @param {object} asset - The asset object
 * @param {string} assetId - The ID of the asset
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise with an array of file IDs
 */
async function getFileIds(asset, assetId, { transacting }) {
  const fileIds = [];
  const bookmark = await getBookmark(assetId, { transacting });

  if (bookmark) {
    asset.fileType = 'bookmark';
    asset.metadata = [];

    if (bookmark.icon) fileIds.push(bookmark.icon);
  }

  if (asset.cover) {
    fileIds.push(asset.cover);
  }

  const assetFiles = await tables.assetsFiles.find({ asset: assetId }, { transacting });
  fileIds.push(..._.map(assetFiles, 'file'));

  return fileIds;
}

/**
 * Get tags
 * @param {string} assetId - The ID of the asset
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise with an array of tags
 */
async function getTags(assetId, { transacting }) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const [tags] = await tagsService.getValuesTags(assetId, {
    type: leemons.plugin.prefixPN(''),
    transacting,
  });

  return tags;
}

/**
 * Duplicate and update cover
 * @param {object} newAsset - The new asset object
 * @param {object} cover - The cover object
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise that resolves to the new asset with updated cover
 */
async function duplicateAndUpdateCover(newAsset, cover, { transacting }) {
  if (!cover) return newAsset;

  const newCover = await duplicateFile(cover, { transacting });
  if (!newCover) return newAsset;

  await tables.assets.update({ id: newAsset.id }, { cover: newCover.id }, { transacting });
  newAsset.cover = newCover;
  return newAsset;
}

/**
 * Duplicate and update bookmark
 * @param {object} newAsset - The new asset object
 * @param {Array} files - The files array
 * @param {string} assetId - The ID of the asset
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise that resolves to the new asset with updated bookmark
 */
async function duplicateAndUpdateBookmark(newAsset, files, assetId, { transacting }) {
  const bookmark = await getBookmark(assetId, { transacting });
  if (!bookmark) return newAsset;

  let newIconId = null;
  if (bookmark.icon) {
    const icon = _.find(files, { id: bookmark.icon });
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
 * Duplicate and update files
 * @param {object} newAsset - The new asset object
 * @param {Array} files - The files array
 * @param {object} userSession - The user session object
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise that resolves to the new asset with updated files
 */
async function duplicateAndUpdateFiles(newAsset, files, userSession, { transacting }) {
  if (!files.length) return newAsset;

  const newFilesPromises = files.map(file => file.id !== newAsset.cover?.id ? duplicateFile(file, { transacting }) : null);
  const newFiles = await Promise.all(newFilesPromises);
  const filesToAddPromises = newFiles.map(f => f ? addFiles(f.id, newAsset.id, { skipPermissions: true, userSession, transacting }) : null);
  await Promise.allSettled(filesToAddPromises);
  if (!_.isEmpty(newFiles)) {
    newAsset.file = newAsset.cover ? newFiles.filter(item => item.id !== newAsset.cover.id) : newFiles[0];
  }
  return newAsset;
}

/**
 * Create asset
 * @param {object} asset - The asset object
 * @param {Array} tags - The tags array
 * @param {Array} permissions - The permissions array
 * @param {boolean} preserveName - The preserve name flag
 * @param {boolean} indexable - The indexable flag
 * @param {boolean} isPublic - The public flag
 * @param {object} options - The options object
 * @returns {Promise<object>} - Returns a promise that resolves to the new asset
 */
async function handleCreateAsset(asset, tags, permissions, preserveName, isIndexable, isPublic, { newId, userSession, transacting }) {
  const assetData = _.omit(asset, [
    'id',
    'file',
    'cover',
    'icon',
    'category',
    'fromUser',
    'fromUserAgent',
    'created_at',
    'updated_at',
  ]);
  const name = isTruthy(preserveName) ? asset.name : `${asset.name} (1)`;
  const indexable = isIndexable === undefined ? asset.indexable : isTruthy(isIndexable);
  const public = isPublic === undefined ? asset.public : isTruthy(isPublic);

  const newAsset = await add.call(
    this,
    {
      ...assetData,
      tags,
      name,
      categoryId: asset.category,
      permissions,
      indexable,
      public,
    },
    { newId, userSession, transacting, duplicating: true }
  );

  return newAsset;
}

/**
 * Post creation
 * @param {object} newAsset - The new asset object
 * @param {object} cover - The cover object
 * @param {Array} files - The files array
 * @param {string} assetId - The ID of the asset
 * @param {object} userSession - The user session object
 * @param {object} transacting - The transaction object
 * @returns {Promise<object>} - Returns a promise that resolves to the new asset with updated cover, bookmark and files
 */
async function handlePostCreation(newAsset, cover, files, assetId, userSession, { transacting }) {
  newAsset = await duplicateAndUpdateCover(newAsset, cover, { transacting });
  newAsset = await duplicateAndUpdateBookmark(newAsset, files, assetId, { transacting });
  newAsset = await duplicateAndUpdateFiles(newAsset, files, userSession, { transacting });
  return newAsset;
}

// ------------------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Duplicate an asset
 * @param {string} assetId - The ID of the asset
 * @param {object} options - The options object
 * @returns {Promise<object>} - Returns a promise that resolves to the duplicated asset
 * @throws {HttpError} - Throws an HTTP error if the operation fails
 */
async function duplicate(
  assetId,
  {
    preserveName = false,
    newId,
    indexable,
    public: isPublic,
    userSession,
    permissions,
    transacting,
  }
) {
  const pPermissions = normalizeItemsArray(permissions);
  await checkDuplicatePermissions(assetId, { userSession, transacting });

  const asset = await getAssetById(assetId, { transacting });
  await checkCategoryDuplicable(asset, { transacting });

  const fileIds = await getFileIds(asset, assetId, { transacting });
  const files = await tables.files.find({ id_$in: fileIds }, { transacting });
  const cover = _.find(files, { id: asset.cover });

  const tags = await getTags(assetId, { transacting });

  const newAsset = await handleCreateAsset(asset, tags, pPermissions, preserveName, indexable, isPublic, { newId, userSession, transacting });
  await handlePostCreation(newAsset, cover, files, assetId, userSession, { transacting });

  return newAsset;
}


module.exports = { duplicate };