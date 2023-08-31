/* eslint-disable no-param-reassign */
const { map, isEmpty, isNil, isString, isArray, forEach } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { tables } = require('../tables');
const { add: addFiles } = require('./files/add');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../bookmarks/add');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');
const { normalizeItemsArray } = require('../shared');
const { handleBookmarkData } = require('./handleBookmarkData');
const { handleUserSessionData } = require('./handleUserSessionData');
const { handleCategoryData } = require('./handleCategoryData');
const { checkAndHandleCanUse } = require('./checkAndHandleCanUse');
const { handleFileUpload } = require('./handleFileUpload');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * This function handles the creation of a new asset version.
 * It generates a new ID if not provided and returns it.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string} params.newId - The new ID for the asset. If not provided, a new ID will be generated.
 * @param {string} params.categoryId - The ID of the category. This is used to prefix the new ID.
 * @param {boolean} params.published - Whether the asset is published. This is used in the version control registration.
 * @param {Object} params.transacting - The transaction object. This is used in the version control registration.
 * @returns {Promise<string>} The new ID of the asset.
 */
async function handleVersion({ newId, categoryId, published, transacting }) {
  if (isNil(newId) || isEmpty(newId)) {
    // ES: Añadimos el control de versiones
    // EN: Add version control
    const { versionControl } = leemons.getPlugin('common').services;
    const { fullId } = await versionControl.register(leemons.plugin.prefixPN(categoryId), {
      published,
      transacting,
    });

    newId = fullId;
  }
  return newId;
}

/**
 * This function creates a new asset in the database.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string} params.newId - The new ID for the asset. This is a unique identifier for the asset.
 * @param {string} params.categoryId - The ID of the category to which the asset belongs.
 * @param {string} params.coverId - The ID of the cover image for the asset.
 * @param {Object} params.assetData - An object containing the data for the asset. This includes information such as the asset's name, description, etc.
 * @param {Object} params.transacting - The transaction object. This is used to handle the database transaction for the creation of the asset.
 * @returns {Promise<Object>} A promise that resolves with the created asset object.
 */
async function createAssetInDB({ newId, categoryId, coverId, assetData, transacting }) {
  return tables.assets.create(
    { ...assetData, id: newId, category: categoryId, cover: coverId },
    { transacting }
  );
}

/**
 * Handle the subjects of the asset.
 * It creates a new entry in the assetsSubjects table for each subject associated with the asset.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {Array} params.subjects - An array of subjects associated with the asset. Each subject is an object that contains the subject's data.
 * @param {string} params.assetId - The unique identifier of the asset. This is used to link the subjects to the asset in the assetsSubjects table.
 * @param {Object} params.transacting - The transaction object. This is used to handle the database transaction for the creation of the asset's subjects.
 */
async function handleSubjects({ subjects, assetId, transacting }) {
  return Promise.all(
    map(subjects, (item) =>
      tables.assetsSubjects.create({ asset: assetId, ...item }, { transacting })
    )
  );
}

/**
 * Handles the permissions of the asset.
 * This function adds permissions to the asset and assigns these permissions to users.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {Array} params.permissions - An array of permissions to be added to the asset. Each permission is an object that contains the permission's data.
 * @param {Array} params.canAccess - An array of users who can access the asset. Each user is represented by an object that contains the user's data.
 * @param {Object} params.asset - The asset to which the permissions are to be added. This is an object that contains the asset's data.
 * @param {Object} params.category - The category to which the asset belongs. This is an object that contains the category's data.
 * @param {Object} params.userSession - The user session. This is an object that contains the user's session data.
 * @param {Object} params.transacting - The transaction object. This is used to handle the database transaction for the creation of the asset's permissions.
 */
async function handlePermissions({
  permissions,
  canAccess,
  asset,
  category,
  userSession,
  transacting,
}) {
  const { services: userService } = leemons.getPlugin('users');
  const permissionName = getAssetPermissionName(asset.id);

  // ES: Primero, añadimos permisos al archivo
  // EN: First, add permission to the asset
  const permissionsPromises = [
    userService.permissions.addItem(
      asset.id,
      leemons.plugin.prefixPN(category.id),
      {
        permissionName,
        actionNames: leemons.plugin.config.constants.assetRoles,
      },
      { isCustomPermission: true, transacting }
    ),
  ];

  if (permissions && permissions.length) {
    forEach(permissions, ({ isCustomPermission, canEdit, canView, canAssign, ...per }) => {
      let permission = 'can-view';
      if (canEdit) {
        permission = 'can-edit';
      } else if (canAssign) {
        permission = 'can-assign';
      }
      permissionsPromises.push(
        userService.permissions.addItem(
          asset.id,
          leemons.plugin.prefixPN(`asset.${permission}`),
          per,
          { isCustomPermission, transacting }
        )
      );
    });
  }
  await Promise.all(permissionsPromises);
  // ES: Luego, añade los permisos a los usuarios
  // EN: Then, add the permissions to the users
  const permissionsToAdd = [];
  let hasOwner = false;

  if (canAccess && !isEmpty(canAccess)) {
    for (let i = 0, len = canAccess.length; i < len; i++) {
      const { userAgent, role } = canAccess[i];
      hasOwner = hasOwner || role === 'owner';

      permissionsToAdd.push(
        userService.permissions.addCustomPermissionToUserAgent(
          userAgent,
          {
            permissionName,
            actionNames: [role],
            target: category.id,
          },
          { transacting }
        )
      );
    }
  }

  if (!hasOwner) {
    permissionsToAdd.push(
      userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName,
          actionNames: ['owner'],
          target: category.id,
        },
        { transacting }
      )
    );
  }

  await Promise.all(permissionsToAdd);
}

/**
 * Handles the files of the asset.
 *
 * @async
 * @param {Object} params - The parameters object.
 * @param {string} params.newFile - The new file of the asset.
 * @param {string} params.assetId - The ID of the asset.
 * @param {Object} params.userSession - The user session.
 * @param {Object} params.transacting - The transaction object.
 */
async function handleFiles({ newFile, assetId, userSession, transacting }) {
  if (isString(newFile?.id)) {
    try {
      await addFiles(newFile.id, assetId, {
        skipPermissions: true,
        userSession,
        transacting,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * This function is responsible for adding a new asset to the database.
 * The function handles the entire process of asset creation including file upload, version handling, permission assignment, and more.
 *
 * @async
 * @param {Object} assetData - The data of the asset to add. This includes information such as the asset's name, description, etc.
 * @param {Object} options - Additional options for adding the asset.
 * @param {string} options.newId - The new ID for the asset. If not provided, a new ID will be generated.
 * @param {boolean} options.published - Whether the asset is published. Defaults to true.
 * @param {Object} options.userSession - The user session. This includes information about the user's session.
 * @param {Array} options.permissions - The permissions for the asset. Each permission is an object that contains the permission's data.
 * @param {Object} options.transacting - The transaction object. This is used to handle the database transaction for the creation of the asset.
 * @param {boolean} options.duplicating - Whether the asset is a duplicate. Defaults to false.
 * @returns {Promise<Object>} A promise that resolves with the added asset object.
 */
async function add({
  asset: { file, cover, category, canAccess, ...data },
  options: { newId, published = true, permissions, duplicating = false } = {},
  ctx,
}) {
  const { userSession } = ctx.meta;
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

  if (userSession) {
    assetData = handleUserSessionData({ assetData, userSession, ctx });
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
    ctx
  });

  return global.utils.withTransaction(
    async (transacting) => {
      const promises = [];

      // ··········································································
      // CREATE ASSET

      newId = await handleVersion({
        newId,
        categoryId: category.id,
        published,
        transacting,
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
        transacting,
      });

      // ··········································································
      // HANDLE SUBJECTS

      if (subjects && subjects.length) {
        await handleSubjects({ subjects, assetId: newAsset.id, transacting });
      }

      // ··········································································
      // ADD PERMISSIONS

      await handlePermissions({
        permissions: pPermissions,
        canAccess,
        asset: newAsset,
        category,
        userSession,
        transacting,
      });

      // ··········································································
      // ADD FILES

      // EN: Assign the file to the asset
      // ES: Asignar el archivo al asset

      await handleFiles({ newFile, assetId: newAsset.id, userSession, transacting });

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
    },
    tables.assets,
    t
  );
}

module.exports = { add };
