const { map } = require('lodash');
const { tables } = require('../tables');
const { upload: uploadFile } = require('../files/upload');
const { add: addFiles } = require('./files/add');
const { add: addCategory } = require('./categories/add');
const { validateAddAsset } = require('../../validations/forms');

async function add({ file, cover, ...data }, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddAsset(data);

      const { categoryId, ...assetData } = data;

      if (userSession) {
        assetData.fromUser = userSession.id;
        assetData.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }

      // ··········································································
      // UPLOAD FILE

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const newFile = await uploadFile(file, { name: assetData.name }, { transacting });
      let coverFile;

      if (newFile?.type?.indexOf('image') === 0) {
        coverFile = newFile;
      }

      if (!coverFile && cover) {
        coverFile = await uploadFile(cover, { name: assetData.name }, { transacting });
      }

      // ··········································································
      // CREATE ASSET

      // EN: Firstly create the asset in the database to get the id
      // ES: Primero creamos el archivo en la base de datos para obtener el id
      const newAsset = await tables.assets.create(
        { ...assetData, cover: coverFile?.id },
        { transacting }
      );

      // ··········································································
      // ADD PERMISSIONS

      const { services: userService } = leemons.getPlugin('users');

      // First, add permission to the asset
      await userService.permissions.addItem(
        newAsset.id,
        leemons.plugin.prefixPN('asset'),
        {
          permissionName: leemons.plugin.prefixPN(newAsset.id),
          actionNames: leemons.plugin.config.constants.assetRoles,
        },
        { isCustomPermission: true, transacting }
      );

      // Second, add the same permission to the user
      await userService.permissions.addCustomPermissionToUserAgent(
        map(userSession.userAgents, 'id'),
        {
          permissionName: leemons.plugin.prefixPN(newAsset.id),
          actionNames: ['owner'],
        },
        { transacting }
      );

      // ··········································································
      // ADD FILES

      const promises = [];

      // EN: Assign the file to the asset
      // ES: Asignar el archivo al asset
      promises.push(addFiles(newFile.id, newAsset.id, { userSession, transacting }));

      // ··········································································
      // ADD CATEGORY

      promises.push(addCategory(newAsset.id, categoryId, { transacting }));

      // ··········································································
      // PROCCESS EVERYTHING

      await Promise.all(promises);

      return { ...newAsset, file: newFile, cover: coverFile };
    },
    tables.assets,
    t
  );
}

module.exports = { add };
