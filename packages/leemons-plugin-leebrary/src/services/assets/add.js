const { map, isEmpty, isNil, isString, isArray, trim, forEach, compact } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { tables } = require('../tables');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../bookmarks/add');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');
const { normalizeItemsArray } = require('../shared');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Handles the bookmark data.
 * @async
 * @param {Object} data - The data of the bookmark.
 * @param {string} data.categoryKey - The category key of the bookmark.
 * @param {string} data.url - The URL of the bookmark.
 * @param {string} data.icon - The icon of the bookmark.
 * @param {string} data.name - The name of the bookmark.
 * @param {string} data.description - The description of the bookmark.
 * @param {string} data.cover - The cover of the asset.
 * @param {string} cover - The cover of the bookmark.
 * @returns {Promise<Object>} The handled bookmark data.
 */
async function handleBookmarkData(data, cover) {
  if (data.categoryKey === CATEGORIES.BOOKMARKS) {
    if (isString(data.url) && !isEmpty(data.url) && (isNil(data.icon) || isEmpty(data.icon))) {
      try {
        const { body: html } = await global.utils.got(data.url);
        const metas = await global.utils.metascraper({ html, url: data.url });
        data.name = !isEmpty(data.name) && data.name !== 'null' ? data.name : metas.title;
        data.description = data.description || metas.description;
        if (isEmpty(trim(data.cover))) data.cover = null;
        data.cover = cover ?? metas.image;
        cover = data.cover;
        if (!isEmpty(metas.logo)) {
          data.icon = data.icon || metas.logo;
        }
      } catch (err) {
        console.error('Error getting bookmark metadata:', data.url, err);
      }
    }
  }
  return data;
}

/**
 * Handles the user session data.
 * @param {Object} assetData - The data of the asset.
 * @param {Object} userSession - The user session.
 * @returns {Object} The handled asset data.
 */
function handleUserSessionData(assetData, userSession) {
  if (userSession) {
    assetData.fromUser = userSession.id;
    assetData.fromUserAgent =
      userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  }
  return assetData;
}

/**
 * Handles the category data.
 * @async
 * @param {string} category - The category of the asset.
 * @param {string} categoryId - The ID of the category.
 * @param {string} categoryKey - The key of the category.
 * @returns {Promise<Object>} The handled category data.
 */
async function handleCategoryData(category, categoryId, categoryKey) {
  if (isEmpty(category)) {
    if (!isEmpty(categoryId)) {
      category = await getCategoryById(categoryId);
    } else {
      category = await getCategoryByKey(categoryKey);
    }
  } else if (isString(category)) {
    if (
      category.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      category = await getCategoryById(category);
    } else {
      category = await getCategoryByKey(category);
    }
  }
  return category;
}

/**
 * Handles the can use data.
 * @param {Array} canUse - The can use data.
 * @param {Object} category - The category of the asset.
 * @returns {Array} The handled can use data.
 */
function handleCanUseData(canUse, category) {
  if (isArray(category?.canUse) && category?.canUse.length) {
    canUse = [...canUse, ...category.canUse];
  }
  return canUse;
}

/**
 * Checks the category permission.
 * @param {Object} category - The category of the asset.
 * @param {Array} canUse - The can use data.
 * @param {string} calledFrom - The plugin that called the function.
 * @throws {HttpError} If the category was not created by the plugin that called the function.
 */
function checkCategoryPermission(category, canUse, calledFrom) {
  if (category?.canUse !== '*' && !canUse.includes(calledFrom)) {
    throw new global.utils.HttpError(
      403,
      `Category "${category.key}" was not created by the plugin "${calledFrom}". You can only add assets to categories created by the plugin "${calledFrom}".`
    );
  }
}

/**
 * Handles the file upload.
 * @async
 * @param {string} file - The file to upload.
 * @param {string} cover - The cover of the asset.
 * @param {string} assetName - The name of the asset.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} The uploaded file and cover.
 */
async function handleFileUpload(file, cover, assetName, transacting) {
  let newFile = null;
  let coverFile = null;
  if (!isEmpty(file)) {
    newFile = await uploadFromSource(file, { name: assetName }, { transacting });
    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }
  }
  if (!coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource(cover, { name: assetName }, { transacting });
  }
  return { newFile, coverFile };
}

/**
 * Handles the asset version creation.
 * @async
 * @param {string} newId - The new ID for the asset.
 * @param {string} categoryId - The ID of the category.
 * @param {boolean} published - Whether the asset is published.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<string>} The new ID of the asset.
 */
async function handleVersionCreation(newId, categoryId, published, transacting) {
  if (isNil(newId) || isEmpty(newId)) {
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
 * Creates an asset in the database.
 * @async
 * @param {string} newId - The new ID for the asset.
 * @param {string} categoryId - The ID of the category.
 * @param {string} coverId - The ID of the cover.
 * @param {Object} assetData - The data of the asset.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} The created asset.
 */
async function createAssetInDB(newId, categoryId, coverId, assetData, transacting) {
  return await tables.assets.create(
    { ...assetData, id: newId, category: categoryId, cover: coverId },
    { transacting }
  );
}

/**
 * Handles the subjects of the asset.
 * @async
 * @param {Array} subjects - The subjects of the asset.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} transacting - The transaction object.
 */
async function handleSubjects(subjects, assetId, transacting) {
  if (subjects && subjects.length) {
    await Promise.all(
      map(subjects, (item) =>
        tables.assetsSubjects.create({ asset: assetId, ...item }, { transacting })
      )
    );
  }
}

/**
 * Handles the permissions of the asset.
 * @async
 * @param {Array} permissions - The permissions of the asset.
 * @param {string} assetId - The ID of the asset.
 * @param {string} categoryId - The ID of the category.
 * @param {Array} canAccess - The can access data.
 * @param {Object} userSession - The user session.
 * @param {Object} transacting - The transaction object.
 */
async function handlePermissions(permissions, assetId, categoryId, canAccess, userSession, transacting) {
  const { services: userService } = leemons.getPlugin('users');
  const permissionName = getAssetPermissionName(assetId);
  const permissionsPromises = [
    userService.permissions.addItem(
      assetId,
      leemons.plugin.prefixPN(categoryId),
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
          assetId,
          leemons.plugin.prefixPN(`asset.${permission}`),
          per,
          { isCustomPermission, transacting }
        )
      );
    });
  }
  await Promise.all(permissionsPromises);
  const result = [];
  let hasOwner = false;
  if (canAccess && !isEmpty(canAccess)) {
    for (let i = 0, len = canAccess.length; i < len; i++) {
      const { userAgent, role } = canAccess[i];
      hasOwner = hasOwner || role === 'owner';
      result.push(
        userService.permissions.addCustomPermissionToUserAgent(
          userAgent,
          {
            permissionName,
            actionNames: [role],
            target: categoryId,
          },
          { transacting }
        )
      );
    }
  }
  if (!hasOwner) {
    result.push(
      userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName,
          actionNames: ['owner'],
          target: categoryId,
        },
        { transacting }
      )
    );
  }
  await Promise.all(result);
}

/**
 * Handles the files of the asset.
 * @async
 * @param {string} newFile - The new file of the asset.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} userSession - The user session.
 * @param {Object} transacting - The transaction object.
 */
async function handleFiles(newFile, assetId, userSession, transacting) {
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

/**
 * Handles the bookmark creation.
 * @async
 * @param {boolean} duplicating - Whether the asset is a duplicate.
 * @param {string} categoryKey - The key of the category.
 * @param {Object} assetData - The data of the asset.
 * @param {Object} newAsset - The new asset.
 * @param {Object} transacting - The transaction object.
 */
async function handleBookmarkCreation(duplicating, categoryKey, assetData, newAsset, transacting) {
  if (!duplicating && categoryKey === CATEGORIES.BOOKMARKS) {
    await addBookmark({ url: assetData.url, iconUrl: assetData.icon }, newAsset, {
      transacting,
    });
  }
}

/**
 * Handles the tags of the asset.
 * @async
 * @param {Array} tags - The tags of the asset.
 * @param {string} assetId - The ID of the asset.
 * @param {Object} transacting - The transaction object.
 */
async function handleTags(tags, assetId, transacting) {
  if (tags?.length > 0) {
    const tagsService = leemons.getPlugin('common').services.tags;
    await tagsService.setTagsToValues(leemons.plugin.prefixPN(''), tags, assetId, {
      transacting,
    });
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Adds an asset to the database.
 * @async
 * @param {Object} assetData - The data of the asset to add.
 * @param {Object} options - Additional options.
 * @param {string} options.newId - The new ID for the asset.
 * @param {boolean} options.published - Whether the asset is published.
 * @param {Object} options.userSession - The user session.
 * @param {Array} options.permissions - The permissions for the asset.
 * @param {Object} options.transacting - The transaction object.
 * @param {boolean} options.duplicating - Whether the asset is a duplicate.
 * @returns {Promise<Object>} The added asset.
 */
async function add(
  { file, cover, category, canAccess, ...data },
  {
    newId,
    published = true,
    userSession,
    permissions,
    transacting: t,
    duplicating = false,
  } = {}
) {

  /* permissions example
    [
      {
        canEdit: true,
        isCustomPermission: true,
        permissionName: 'plugins.calendar.calendar.idcalendario',
        actionNames: ['view', 'delete', 'admin', 'owner'],
      },
    ]
  */

  const pPermissions = normalizeItemsArray(permissions);
  const categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;
  let assetData = await handleBookmarkData({ ...data, categoryKey }, cover);

  await validateAddAsset(assetData);

  const { categoryId, categoryKey: assetCategoryKey, tags, subjects, ...otherAssetData } = assetData;
  assetData = handleUserSessionData({ ...otherAssetData }, userSession);

  const categoryData = await handleCategoryData(category, categoryId, assetCategoryKey);
  let canUse = [leemons.plugin.prefixPN(''), categoryData?.pluginOwner];
  canUse = handleCanUseData(canUse, categoryData);

  checkCategoryPermission(categoryData, canUse, this.calledFrom);

  // If the asset is valid & the caller has permissions, then move forward
  let { newFile, coverFile } = await handleFileUpload(file, cover, assetData.name, t);

  return global.utils.withTransaction(
    async (transacting) => {
      newId = await handleVersionCreation(newId, categoryData.id, published, transacting);
      assetData.indexable = isNil(assetData.indexable) ? true : assetData.indexable;
      const newAsset = await createAssetInDB(newId, categoryData.id, coverFile?.id, assetData, transacting);

      await handleSubjects(subjects, newAsset.id, transacting);
      await handlePermissions(pPermissions, newAsset.id, categoryData.id, canAccess, userSession, transacting);
      await handleFiles(newFile, newAsset.id, userSession, transacting);
      await handleBookmarkCreation(duplicating, categoryData.key, assetData, newAsset, transacting);
      await handleTags(tags, newAsset.id, transacting);

      return { ...newAsset, subjects, file: newFile, cover: coverFile, tags };
    },
    tables.assets,
    t
  );
}

module.exports = {
  add,
  handleBookmarkData,
  handleUserSessionData,
  handleCategoryData,
  handleCanUseData,
  checkCategoryPermission,
  handleFileUpload,
  handleVersionCreation,
  createAssetInDB,
  handleSubjects,
  handlePermissions,
  handleFiles,
  handleBookmarkCreation,
  handleTags

};
