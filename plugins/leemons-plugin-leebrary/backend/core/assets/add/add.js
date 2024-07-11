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
const { createAssetInDB } = require('./createAssetInDb');
const { handleSubjects } = require('./handleSubjects');
const { handlePermissions } = require('./handlePermissions');
const { handleFiles } = require('./handleFiles');

/*
* permissions example
* [
    {
      canEdit: true,
      isCustomPermission: true,
      permissionName: 'calendar.calendar.idcalendario',
      actionNames: ['view', 'delete', 'admin', 'owner'],
    },
  ]
* */

/**
 * This function is responsible for adding a new asset to the database.
 * The function handles the entire process of asset creation including file upload, version handling, permission assignment, and more.
 *
 * @async
 * @param {Object} params - The main parameter object.
 * @param {Object} params.assetData - The data of the asset to add. This includes information such as the asset's name, description, related url, etc.
 * @param {string} [params.newId] - The new ID for the asset. If not provided, a new ID will be generated.
 * @param {boolean} [params.published=true] - Whether the asset is published.
 * @param {Array} [params.permissions] - The permissions for the asset. Each permission is an object that contains the permission's data.
 * @param {boolean} [params.duplicating=false] - Whether the asset is a duplicate.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} A promise that resolves with the added asset object.
 */
async function add({
  asset: _assetData,
  newId,
  published = true,
  permissions,
  duplicating = false,
  ctx,
}) {
  // eslint-disable-next-line prefer-const
  let { file, cover, category, canAccess, ...data } = _assetData;
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

  // Add url to the asset document in DB only for media-files
  // For bookmarks keep it to be saved later in the bookmark document itself
  let bookmarkUrl = null;
  if (category.key === CATEGORIES.BOOKMARKS) {
    bookmarkUrl = data.url;
    delete assetData.url;
  }

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

  if (subjects?.length) {
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
      addBookmark({
        url: bookmarkUrl,
        mediaType: assetData.mediaType,
        // iconUrl: assetData.icon,
        asset: newAsset,
        ctx,
      })
    );
  }

  // ··········································································
  // ADD TAGS

  if (tags?.length > 0) {
    promises.push(
      ctx.tx.call('common.tags.setTagsToValues', {
        type: ctx.prefixPN(''),
        tags,
        values: newAsset.id,
      })
    );
  }

  // ··········································································
  // FINALLY
  await Promise.all(promises);

  return { ...newAsset, subjects, file: newFile, cover: coverFile, tags };
}

module.exports = { add };
