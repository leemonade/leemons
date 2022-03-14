const { tables } = require('../tables');
const { uplad: uploadFile } = require('../files/upload');
const { add: addFiles } = require('./files/add');
const { set: setPermissions } = require('../permissions/set');

async function add({ file, ...data }, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const assetData = { ...data };

      if (userSession) {
        assetData.fromUser = userSession.id;
        assetData.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }

      // EN: Firstly create the asset in the database to get the id
      // ES: Primero creamos el archivo en la base de datos para obtener el id
      const newAsset = await tables.assets.create(assetData, { transacting });

      // EN: Set asset owner
      // ES: Asignar propietario del archivo
      await setPermissions(newAsset.id, userSession.userAgents[0].id, 'owner', {
        userSession,
        transacting,
      });

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const newFile = await uploadFile(
        file,
        {
          name: assetData.name,
          fromUser: assetData.fromUser,
          fromUserAgent: assetData.fromUserAgent,
        },
        { transacting }
      );

      // EN: Assign the file to the asset
      // ES: Asignar el archivo al asset
      await addFiles(newFile.id, newAsset.id, { userSession, transacting });

      return newAsset;
    },
    tables.assets,
    t
  );
}

module.exports = { add };
