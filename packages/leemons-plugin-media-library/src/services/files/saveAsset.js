const mime = require('mime-types');
const { files: table } = require('../tables');
const { uploadFile } = require('./uploadFile');

function saveAsset(data, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { type } = data.file;
      const extension = mime.extension(type);

      const asset = {
        provider: 'sys',
        name: data.name,
        description: data.description,
        type,
        extension,
        uri: '',
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
      let item = await table.create(asset, { transacting });

      // EN: Upload the file to the provider
      // ES: Subir el archivo al proveedor
      const { provider, uri } = await uploadFile(data.file, item, { transacting });

      // EN: Update the asset with the new URI
      // ES: Actualizamos el archivo con la nueva URI
      item = await table.update({ id: item.id }, { provider, uri }, { transacting });
      return item;
    },
    table,
    t
  );
}
module.exports = { saveAsset };
