/* eslint-disable no-param-reassign */
const { map, isEmpty, isNil } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');
const { tables } = require('../tables');
const { uploadFromSource } = require('../files/helpers/uploadFromSource');
const { add: addFiles } = require('./files/add');
const { getById: getCategoryById } = require('../categories/getById');
const { getByKey: getCategoryByKey } = require('../categories/getByKey');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../bookmarks/add');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');

async function add(
  { file, cover, category, ...data },
  { newId, published = true, userSession, transacting: t } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ES: Asignamos la categoría de "media-files" por defecto.
      // EN: Assign the "media-files" category by default.
      data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;
      await validateAddAsset(data);

      const { categoryId, categoryKey, tags, ...assetData } = data;

      if (userSession) {
        assetData.fromUser = userSession.id;
        assetData.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }

      if (isEmpty(category)) {
        if (!isEmpty(categoryId)) {
          // eslint-disable-next-line no-param-reassign
          category = await getCategoryById(categoryId, { transacting });
        } else {
          // eslint-disable-next-line no-param-reassign
          category = await getCategoryByKey(categoryKey, { transacting });
        }
      }

      if (![leemons.plugin.prefixPN(''), category?.pluginOwner].includes(this.calledFrom)) {
        throw new global.utils.HttpError(
          403,
          `Category "${category.key}" was not created by the plugin "${this.calledFrom}". You can only add assets to categories created by the plugin "${this.calledFrom}".`
        );
      }

      // ··········································································
      // UPLOAD FILE

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor

      let newFile;
      let coverFile;

      // Media files
      if (!isEmpty(file)) {
        newFile = await uploadFromSource(file, { name: assetData.name }, { transacting });

        if (newFile?.type?.indexOf('image') === 0) {
          coverFile = newFile;
        }
      }

      if (!coverFile && !isEmpty(cover)) {
        coverFile = await uploadFromSource(cover, { name: assetData.name }, { transacting });
      }

      // ··········································································
      // CREATE ASSET

      if (isNil(newId) || isEmpty(newId)) {
        // ES: Añadimos el control de versiones
        // EN: Add version control
        const { versionControl } = leemons.getPlugin('common').services;
        const { fullId } = await versionControl.register(leemons.plugin.prefixPN(''), {
          published,
          transacting,
        });

        // eslint-disable-next-line no-param-reassign
        newId = fullId;
      }

      // EN: Firstly create the asset in the database to get the id
      // ES: Primero creamos el archivo en la base de datos para obtener el id
      const newAsset = await tables.assets.create(
        { ...assetData, id: newId, category: categoryId, cover: coverFile?.id },
        { transacting }
      );

      // ··········································································
      // ADD PERMISSIONS

      const { services: userService } = leemons.getPlugin('users');
      const permissionName = getAssetPermissionName(newAsset.id);

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

      if (tags?.length > 0) {
        const tagsService = leemons.getPlugin('common').services.tags;
        promises.push(
          tagsService.setTagsToValues(leemons.plugin.prefixPN(''), tags, newAsset.id, {
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
