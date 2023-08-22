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
} = require('lodash');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const { tables } = require('../tables');
const { validateAddAsset } = require('../../validations/forms');
const { getByIds: getAssets } = require('./getByIds');
const { duplicate } = require('./duplicate');
const { CATEGORIES } = require('../../../config/constants');
const { getById: getCategory } = require('../categories/getById');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');

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
 * Handles the update object for the asset.
 * 
 * @param {Object} params - The params object.
 * @param {Object} params.currentAsset - The current asset object.
 * @param {Object} params.assetData - The new asset data object.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Array>} An array containing the updated object and the differences.
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
  const { object, diff } = getDiff(newData, currentData);

  return [object, diff];
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
async function handleAssetSubjects({ assetId, subjects, diff, transacting }) {
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
   * Handles the file and cover updates if necessary.
   * @param {Object} params - The params object
   * @param {Object} params.assetData - The asset data object.
   * @param {Array} params.diff - The object with differences.
   * @param {Object} params.updateObject - The update object.
   * @param {Object} params.currentAsset - The current asset object.
   * @param {Object} params.transacting - The transaction object.
   * @returns {Promise<Object>} The updated file and cover objects.
   */
async function handleFileAndCoverUpdates({ assetId, assetData, diff, updateObject, currentAsset, userSession, transacting }) {
  const { file } = assetData;
  const cover = assetData.cover || assetData.coverFile;
  let newFile;
  let coverFile;

  if (diff.includes('file') && !isEmpty(file)) {
    newFile = await uploadFromSource(file, { name: assetData.name }, { transacting });

    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }

    await addFiles(newFile.id, assetId, { userSession, transacting });
    delete updateObject.file;
  }

  if (diff.includes('cover') && !coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource(cover, { name: assetData.name }, { transacting });
  }

  if (coverFile?.id) {
    updateObject.cover = coverFile.id;
  }

  // ES: En caso de que no hayan cambio en los archivos, los dejamos establecidos con su valor actual
  // EN: If there are no changes in the files, we keep the current values
  if (!newFile && !diff.includes('file')) {
    newFile = currentAsset.file;
  }

  if (!coverFile && !diff.includes('cover')) {
    coverFile = currentAsset.cover;
  }

  return { newFile, coverFile, toUpdate: updateObject };
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

  data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  if (isArray(data.subjects)) {
    data.subjects = map(data.subjects, ({ subject, level }) => ({
      subject,
      level,
    }));
  }
  const { id, ...assetData } = data;
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
  const currentAsset = (await getAssets(assetId, { withFiles: true, transacting }))[0];

  if (!currentAsset) {
    throw new global.utils.HttpError(422, 'Asset not found');
  }

  const [rawUpdateObject, diff] = await handleUpdateObject({ currentAsset, assetData, transacting });
  const { subjects, ...updateObject } = rawUpdateObject;

  // ·········································································
  // DUPLICATE ASSET

  const { versionControl } = leemons.getPlugin('common').services;
  const currentVersion = await versionControl.getVersion(assetId, { transacting });

  let checkDiff = false;
  if (upgrade && currentVersion.published) {
    const duplicatedAsset = await handleAssetUpgrade({ assetId, scale, published, userSession, transacting });
    currentVersion.published = published;
    assetId = duplicatedAsset.id;
    currentAsset.id = assetId;
    checkDiff = true;
  }

  if (published && !currentVersion.published) {
    await versionControl.publishVersion(assetId, published, { transacting });
    checkDiff = true;
  }

  if (checkDiff && !diff.length) {
    return currentAsset;
  }

  await handleAssetSubjects({ subjects, diff, transacting });

  // ·········································································
  // CHECKING TAGS

  if (diff.includes('tags')) {
    const tagsService = leemons.getPlugin('common').services.tags;
    const tagsType = leemons.plugin.prefixPN('');

    await tagsService.removeAllTagsForValues(tagsType, assetId, { transacting });
    await tagsService.setTagsToValues(tagsType, updateObject.tags, assetId, {
      transacting,
    });
  }

  // ·········································································
  // CHECKING FILES

  const { newFile, coverFile, toUpdate } = await handleFileAndCoverUpdates({ assetId, assetData, diff, updateObject, currentAsset, userSession, transacting });

  // ·········································································
  // UPDATE ASSET DATA

  // EN: Update the asset
  // ES: Actualizar el asset
  const asset = await tables.assets.update({ id: assetId }, toUpdate, { transacting });

  return { ...asset, subjects, file: newFile, cover: coverFile, tags: newData.tags };
}

module.exports = { update };
