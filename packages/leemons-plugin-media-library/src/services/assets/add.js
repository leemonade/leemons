const { assets: table } = require('../tables');
const { uploadFile } = require('../files/uploadFile');
const addFiles = require('./files/addFiles');
const setPermissions = require('../permissions/set');

module.exports = function add(data, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const asset = {
        cover: data.cover,
        name: data.name,
        description: data.description,
      };

      if (userSession) {
        asset.fromUser = userSession.id;
        asset.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }

      // EN: Firstly create the asset in the database to get the id
      // ES: Primero creamos el archivo en la base de datos para obtener el id
      const item = await table.create(asset, { transacting });

      // EN: Set asset owner
      // ES: Asignar propietario del archivo
      await setPermissions(item.id, userSession.userAgents[0].id, 'owner', {
        userSession,
        transacting,
      });

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const file = await uploadFile(
        data.file,
        { name: data.name, fromUser: asset.fromUser, fromUserAgent: asset.fromUserAgent },
        { transacting }
      );

      // EN: Assign the file to the asset
      // ES: Asignar el archivo al asset
      await addFiles(file.id, item.id, { userSession, transacting });

      return item;
    },
    table,
    t
  );
};
