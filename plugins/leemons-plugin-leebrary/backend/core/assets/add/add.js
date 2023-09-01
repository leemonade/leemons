/* eslint-disable no-param-reassign */
const { isNil } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../../bookmarks/add');
const { normalizeItemsArray } = require('../../shared');
const { handleBookmarkData } = require('./handleBookmarkData');
const { handleUserSessionData } = require('./handleUserSessionData');
const { handleCategoryData } = require('./handleCategoryData');
const { checkAndHandleCanUse } = require('./checkAndHandleCanUse');
const { handleFileUpload } = require('./handleFileUpload');
const { handleVersion } = require('./handleVersion');
const { createAssetInDB } = require('./createAssetInDB');
const { handleSubjects } = require('./handleSubjects');
const { handlePermissions } = require('./handlePermissions');
const { handleFiles } = require('./handleFiles');

/**
 * This function is responsible for adding a new asset to the database.
 * The function handles the entire process of asset creation including file upload, version handling, permission assignment, and more.
 *
 * @async
 * @param {Object} assetData - The data of the asset to add. This includes information such as the asset's name, description, etc.
 * @param {Object} options - Additional options for adding the asset.
 * @param {string} options.newId - The new ID for the asset. If not provided, a new ID will be generated.
 * @param {boolean} options.published - Whether the asset is published. Defaults to true.
 * @param {Array} options.permissions - The permissions for the asset. Each permission is an object that contains the permission's data.
 * @param {Object} options.transacting - The transaction object. This is used to handle the database transaction for the creation of the asset.
 * @param {boolean} options.duplicating - Whether the asset is a duplicate. Defaults to false.
 * @returns {Promise<Object>} A promise that resolves with the added asset object.
 */
async function add({
  assetData: { file, cover, category, canAccess, ...data },
  options: { newId, published = true, permissions, duplicating = false } = {},
  ctx,
}) {
  const pPermissions = normalizeItemsArray(permissions);

  // ··········································
  // HANDLE BOOKMARK CASE

  // ES: Asignamos la categoría de "media-files" por defecto.
  // EN: Assign the "media-files" category by default.
  data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  // ES: En caso de que se quiera crear un Bookmark, pero no vengan los datos desde el frontend, los obtenemos.
  // EN: In case you want to create a Bookmark, but not come from the frontend, we get them.
  if (data.categoryKey === CATEGORIES.BOOKMARKS) {
    [data, cover] = await handleBookmarkData({ data, cover, ctx });
  }

  // ··········································
  // DATA INTEGRITY VALIDATION
  await validateAddAsset(data);

  // ··········································
  // PROCESS DATA

  // eslint-disable-next-line prefer-const
  let { categoryId, categoryKey, tags, subjects, ...assetData } = data;

  if (ctx.meta.userSession) {
    assetData = handleUserSessionData({ assetData, ctx });
  }

  // ··········································
  // PROCESS CATEGORY AND CHECK PERMISSIONS

  category = await handleCategoryData({ category, categoryId, categoryKey, ctx });
  checkAndHandleCanUse({ category, calledFrom: ctx.callerPlugin, ctx });

  // ··········································································
  // UPLOAD FILE

  // EN: Upload the file to the provider
  // ES: Subir el archivo al proveedor
  const { newFile, coverFile } = await handleFileUpload({
    file,
    cover,
    assetName: assetData.name,
    ctx,
  });

  const promises = [];

  // ··········································································
  // CREATE ASSET
  newId = await handleVersion({
    newId,
    categoryId: category.id,
    published,
    ctx,
  });

  // Set indexable as TRUE by default
  assetData.indexable = isNil(assetData.indexable) ? true : assetData.indexable;

  // EN: Firstly create the asset in the database to get the id
  // ES: Primero creamos el archivo en la base de datos para obtener el id
  const newAsset = await createAssetInDB({
    newId,
    categoryId: category.id,
    coverId: coverFile?.id,
    assetData,
    ctx,
  });

  // ··········································································
  // HANDLE SUBJECTS

  if (subjects && subjects.length) {
    await handleSubjects({ subjects, assetId: newAsset.id, ctx });
  }

  // ··········································································
  // ADD PERMISSIONS

  await handlePermissions({
    permissions: pPermissions,
    canAccess,
    asset: newAsset,
    category,
    ctx,
  });

  // ··········································································
  // ADD FILES

  // EN: Assign the file to the asset
  // ES: Asignar el archivo al asset

  await handleFiles({ newFile, assetId: newAsset.id, ctx });

  // ··········································································
  // CREATE BOOKMARK

  if (!duplicating && category.key === CATEGORIES.BOOKMARKS) {
    promises.push(
      addBookmark({ url: assetData.url, iconUrl: assetData.icon }, newAsset, {
        transacting,
      })
    );
  }

  // ··········································································
  // ADD TAGS

  if (tags?.length > 0) {
    const tagsService = leemons.getPlugin('common').services.tags;
    promises.push(
      tagsService.setTagsToValues(leemons.plugin.prefixPN(''), tags, newAsset.id, {
        transacting,
      })
    );
  }

  // ··········································································
  // FINALLY

  await Promise.all(promises);

  return { ...newAsset, subjects, file: newFile, cover: coverFile, tags };
}

module.exports = { add };
