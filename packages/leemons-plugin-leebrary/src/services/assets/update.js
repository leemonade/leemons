/* eslint-disable no-param-reassign */
const {
  map,
  isArray,
  defaults,
  cloneDeep,
  isEqual,
  differenceWith,
  isEmpty,
  pick,
  compact,
  uniq,
} = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { tables } = require('../tables');
const { validateAddAsset } = require('../../validations/forms');
const { getByIds } = require('./getByIds');
const { duplicate } = require('./duplicate');
const { CATEGORIES } = require('../../../config/constants');
const { getById: getCategory } = require('../categories/getById');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');
const { remove: removeFilesById } = require('./files/remove');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

function getDiff(a, b) {
  const _a = defaults(cloneDeep(a), b);

  if (isEqual(_a, b)) {
    return { object: _a, diff: [] };
  }

  return {
    object: _a,
    diff: differenceWith(Object.entries(_a), Object.entries(b), isEqual).map(([key]) => key),
  };
}

/**
 * Prepares the asset data for further processing.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.data - The asset data object.
 * @returns {Object} The prepared asset data.
 */
function prepareAssetData({ data }) {
  data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  if (isArray(data.subjects)) {
    data.subjects = map(data.subjects, ({ subject, level }) => ({
      subject,
      level,
    }));
  }

  return data;
}

/**
 * This function handles the update object for the asset. It compares the current asset data with the new asset data and returns the updated object and the differences.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.currentAsset - The current asset object.
 * @param {Object} params.assetData - The new asset data object.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} An object containing the updated properties, new data, and the differences.
 */
async function handleUpdateObject({ currentAsset, assetData, transacting }) {
  const compareProps = [
    'name',
    'tagline',
    'description',
    'color',
    'file',
    'cover',
    'public',
    'indexable',
    'tags',
    'program',
    'subjects',
  ];

  const category = await getCategory(currentAsset.category, { transacting });
  if (category.key === CATEGORIES.BOOKMARKS) {
    compareProps.push('url');
  }

  const currentData = pick(currentAsset, compareProps);
  currentData.file = currentAsset.file?.id || null;
  currentData.cover = currentAsset.cover?.id || null;

  const newData = pick(assetData, compareProps);
  newData.file = assetData.file || null;
  newData.cover = assetData.cover || assetData.coverFile || null;

  // EN: Diff the current values with the new ones
  // ES: Compara los valores actuales con los nuevos
  const { object: updateProperties, diff } = getDiff(newData, currentData);

  return { updateProperties, newData, diff };
}

/**
 * Handles the asset version upgrade if the current version is published.
 *
 * @param {object} params - The params object
 * @param {string} params.assetId - The ID of the asset.
 * @param {string} params.scale - The scale of the upgrade.
 * @param {boolean} params.published - A flag indicating whether the asset is published.
 * @param {object} params.userSession - The user's session object.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<object>} The duplicated asset.
 */
async function handleAssetUpgrade({ assetId, scale, published, userSession, transacting }) {
  const { versionControl } = leemons.getPlugin('common').services;
  const { fullId } = await versionControl.upgradeVersion(assetId, scale, {
    published,
    transacting,
  });

  const duplicatedAsset = await duplicate.call(this, assetId, {
    preserveName: true,
    newId: fullId,
    userSession,
    transacting,
  });

  return duplicatedAsset;
}

/**
 * Handles the asset subjects if necessary.
 * @param {Object} params - The params object
 * @param {string} params.assetId - The ID of the asset.
 * @param {Array} params.subjects - The subjects of the asset.
 * @param {Array} params.diff - The object with differences.
 * @param {object} params.transacting - The transaction object.
 * @returns {Promise<void>} Resolves when the subjects are handled.
 */
async function handleSubjectsUpdates({ assetId, subjects, diff, transacting }) {
  if (diff.includes('subjects')) {
    await tables.assetsSubjects.deleteMany({ asset: assetId }, { transacting });
    if (subjects && subjects.length) {
      await Promise.all(
        map(subjects, (item) =>
          tables.assetsSubjects.create({ asset: assetId, ...item }, { transacting })
        )
      );
    }
  }
}

/**
 * Handles the asset tags updates.
 * It removes all existing tags for the asset and sets new tags.
 *
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.updateObject - The object containing the new tags.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<void>} Resolves when the tags are updated.
 */
async function handleTagsUpdates({ assetId, updateObject, transacting }) {
  const tagsService = leemons.getPlugin('common').services.tags;
  const tagsType = leemons.plugin.prefixPN('');

  await tagsService.removeAllTagsForValues(tagsType, assetId, { transacting });
  await tagsService.setTagsToValues(tagsType, updateObject.tags, assetId, {
    transacting,
  });
}

/**
 * Handles the file and cover updates if necessary.
 * @param {Object} params - The params object
 * @param {Object} params.assetData - The asset data object.
 * @param {Array} params.diff - The object with differences.
 * @param {Object} params.updateObject - The update object.
 * @param {Object} params.currentAsset - The current asset object.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} The updated file and cover objects.
 */
async function handleFileAndCoverUpdates({
  assetId,
  assetData,
  updateObject,
  currentAsset,
  fileNeedsUpdate,
  coverNeedsUpdate,
  userSession,
  transacting,
}) {
  const { file } = assetData;
  const cover = assetData.cover || assetData.coverFile;
  const filesToRemove = [];
  let newFile;
  let coverFile;

  if (fileNeedsUpdate && !isEmpty(file)) {
    newFile = await uploadFromSource(file, { name: assetData.name }, { transacting });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
      filesToRemove.push(cover);
    }

    await addFiles(newFile.id, assetId, { userSession, transacting });
    delete updateObject.file;
  }

  if (coverNeedsUpdate && !coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource(cover, { name: assetData.name }, { transacting });
  }

  if (coverFile?.id) {
    updateObject.cover = coverFile.id;
  }

  // ES: En caso de que no hayan cambio en los archivos, los dejamos establecidos con su valor actual
  // EN: If there are no changes in the files, we keep the current values
  if (!newFile && !fileNeedsUpdate) {
    newFile = currentAsset.file;
  }

  if (!coverFile && !coverNeedsUpdate) {
    coverFile = currentAsset.cover;
  }

  return { newFile, coverFile, toUpdate: updateObject, filesToRemove };
}

/**
 * Handles the removal of asset files if necessary.
 * If the file or cover needs to be updated, it removes the old files from the asset.
 *
 * @param {Object} params - The params object.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.assetData - The asset data object.
 * @param {boolean} params.fileNeedsUpdate - A flag indicating whether the file needs to be updated.
 * @param {boolean} params.coverNeedsUpdate - A flag indicating whether the cover needs to be updated.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<void>} Resolves when the files are removed.
 * @throws {Error} If the removal of the files fails.
 */
async function handleFilesRemoval({
  assetId,
  assetData,
  filesToRemove,
  fileNeedsUpdate,
  coverNeedsUpdate,
  transacting,
}) {
  if (fileNeedsUpdate) {
    filesToRemove.push(assetData.file);
  }
  if (coverNeedsUpdate) {
    filesToRemove.push(assetData.cover, assetData.coverFile);
  }
  if (!isEmpty(filesToRemove)) {
    try {
      await removeFilesById(compact(uniq(filesToRemove)), assetId, { transacting });
    } catch (e) {
      //
    }
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Updates an asset in the database.
 *
 * @async
 * @function update
 * @param {object} data - The data to update the asset with.
 * @param {object} options - An object containing various options.
 * @param {boolean} options.upgrade - A flag indicating whether to upgrade the asset.
 * @param {string} options.scale - The scale of the upgrade (default is 'major').
 * @param {boolean} options.published - A flag indicating whether the asset is published (default is true).
 * @param {object} options.userSession - The user's session object.
 * @param {object} options.transacting - The transaction object.
 * @returns {Promise<object>} The updated asset.
 * @throws {Error} If no changes are detected or if the user doesn't have permissions to update the asset.
 */
async function update(
  data,
  { upgrade, scale = 'major', published = true, userSession, transacting } = {}
) {
  if (isEmpty(data)) {
    throw new Error('No changes detected');
  }

  const { id, ...assetData } = prepareAssetData({ data });
  let assetId = id;

  await validateAddAsset(assetData);

  // ·········································································
  // CHECK PERMISSIONS

  // EN: Get user's permissions
  // ES: Obtener los permisos del usuario
  const { permissions } = await getPermissions(assetId, { userSession, transacting });

  // EN: Check if the user has permissions to update the asset
  // ES: Comprobar si el usuario tiene permisos para actualizar el activo
  if (!permissions.edit) {
    throw new global.utils.HttpError(401, "You don't have permissions to update this asset");
  }

  // ·········································································
  // DATA DIFFERENCE

  // EN: Get the current values
  // ES: Obtenemos los valores actuales
  const currentAsset = (await getByIds(assetId, { withFiles: true, transacting }))[0];

  if (!currentAsset) {
    throw new global.utils.HttpError(422, 'Asset not found');
  }

  const { updateProperties, newData, diff } = await handleUpdateObject({
    currentAsset,
    assetData,
    transacting,
  });
  const { subjects, ...updateObject } = updateProperties;

  // ·········································································
  // DUPLICATE ASSET

  const { versionControl } = leemons.getPlugin('common').services;
  const currentVersion = await versionControl.getVersion(assetId, { transacting });

  // ES: Si la versión actual es la publicada, hacemos el upgrade
  // EN: If the current version is the published one, we upgrade
  if (upgrade && currentVersion.published) {
    const duplicatedAsset = await handleAssetUpgrade({
      assetId,
      scale,
      published,
      userSession,
      transacting,
    });
    currentVersion.published = published;
    assetId = duplicatedAsset.id;
    currentAsset.id = assetId;

    if (!diff.length) {
      return currentAsset;
    }
  }

  // EN: If the asset is not published and we want to publish it, we do it
  // ES: Si el activo no está publicado y queremos publicarlo, lo hacemos
  if (published && !currentVersion.published) {
    await versionControl.publishVersion(assetId, published, { transacting });
  }

  if (!diff.length) {
    return currentAsset;
  }

  await handleSubjectsUpdates({ assetId, subjects, diff, transacting });

  // ·········································································
  // HANDLE TAGS

  if (diff.includes('tags')) {
    handleTagsUpdates({ assetId, updateObject, transacting });
  }

  // ·········································································
  // HANDLE FILES

  const fileNeedsUpdate = diff.includes('file');
  const coverNeedsUpdate = diff.includes('cover');

  const { newFile, coverFile, toUpdate, filesToRemove } = await handleFileAndCoverUpdates({
    assetId,
    assetData,
    updateObject,
    currentAsset,
    fileNeedsUpdate,
    coverNeedsUpdate,
    userSession,
    transacting,
  });

  // Removes the old files
  await handleFilesRemoval({
    assetId: id,
    assetData,
    filesToRemove,
    fileNeedsUpdate,
    coverNeedsUpdate,
    transacting,
  });

  // ·········································································
  // UPDATE ASSET DATA

  // EN: Update the asset
  // ES: Actualizar el asset
  const asset = await tables.assets.update({ id: assetId }, toUpdate, { transacting });

  return { ...asset, subjects, file: newFile, cover: coverFile, tags: newData.tags };
}

module.exports = { update };
