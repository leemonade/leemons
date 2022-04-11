const { map, isString, isEmpty } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { tables } = require('../tables');
const { upload: uploadFile, uploadFromUrl: uploadFileFromUrl } = require('../files/upload');
const { add: addFiles } = require('./files/add');
const { getById: getCategory } = require('../categories/getById');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../bookmarks/add');

async function add({ file, cover, category, ...data }, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddAsset(data);

      const { categoryId, tags, ...assetData } = data;

      if (userSession) {
        assetData.fromUser = userSession.id;
        assetData.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }

      if (isEmpty(category)) {
        // eslint-disable-next-line no-param-reassign
        category = await getCategory(categoryId, { transacting });
      }

      // ··········································································
      // UPLOAD FILE

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor

      let newFile;
      let coverFile;

      // Bookmarks
      if (category.key === CATEGORIES.BOOKMARKS && !isEmpty(cover)) {
        if (isString(cover)) {
          newFile = await uploadFileFromUrl(cover, { name: assetData.name }, { transacting });
        } else {
          newFile = await uploadFile(cover, { name: assetData.name }, { transacting });
        }

        coverFile = newFile;
      }
      // Media files
      else if (category.key === CATEGORIES.MEDIA_FILES && !isEmpty(file)) {
        newFile = await uploadFile(file, { name: assetData.name }, { transacting });

        if (newFile?.type?.indexOf('image') === 0) {
          coverFile = newFile;
        }

        if (!coverFile && cover) {
          coverFile = await uploadFile(cover, { name: assetData.name }, { transacting });
        }
      }

      // ··········································································
      // CREATE ASSET

      // EN: Firstly create the asset in the database to get the id
      // ES: Primero creamos el archivo en la base de datos para obtener el id
      const newAsset = await tables.assets.create(
        { ...assetData, category: categoryId, cover: coverFile?.id },
        { transacting }
      );

      // ··········································································
      // ADD PERMISSIONS

      const { services: userService } = leemons.getPlugin('users');
      const permissionName = leemons.plugin.prefixPN(newAsset.id);

      // First, add permission to the asset
      await userService.permissions.addItem(
        newAsset.id,
        leemons.plugin.prefixPN(categoryId),
        {
          permissionName,
          actionNames: leemons.plugin.config.constants.assetRoles,
        },
        { isCustomPermission: true, transacting }
      );

      // TODO: move permission "target" prop to "type" in IntemPermission
      // Second, add the same permission to the user
      await userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName,
          actionNames: ['owner'],
          target: categoryId,
        },
        { transacting }
      );

      // ··········································································
      // ADD FILES

      const promises = [];

      // EN: Assign the file to the asset
      // ES: Asignar el archivo al asset

      if (newFile?.id) {
        promises.push(addFiles(newFile.id, newAsset.id, { userSession, transacting }));
      }

      // ··········································································
      // CREATE BOOKMARK

      if (category.key === CATEGORIES.BOOKMARKS) {
        promises.push(
          addBookmark({ url: assetData.url, iconUrl: assetData.icon }, newAsset, {
            transacting,
          })
        );
      }

      // ··········································································
      // ADD TAGS

      let tagValues = tags || [];

      if (isString(tagValues)) {
        tagValues = tagValues.split(',');
      }

      if (tagValues?.length > 0) {
        const tagsService = leemons.getPlugin('common').services.tags;
        promises.push(
          tagsService.setTagsToValues(leemons.plugin.prefixPN(''), tagValues, newAsset.id, {
            transacting,
          })
        );
      }

      // ··········································································
      // PROCCESS EVERYTHING

      await Promise.all(promises);

      return { ...newAsset, file: newFile, cover: coverFile, tags };
    },
    tables.assets,
    t
  );
}

module.exports = { add };
