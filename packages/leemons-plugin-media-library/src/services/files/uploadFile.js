const _ = require('lodash');

const pathSys = require('path');
const mime = require('mime-types');
const { table } = require('../tables');

async function uploadFile(file, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { path, name, type } = file;
      const extension = mime.extension(type);

      // ES: Creamos temporalmente el archivo para asi tener la id que usaremos de nombre
      const toCreate = {
        provider: 'sys',
        type,
        extension,
        name: name.replace(`.${extension}`, ''),
        url: '',
      };
      if (userSession) {
        toCreate.fromUser = userSession.id;
        toCreate.fromUserAgent =
          userSession.userAgents && userSession.userAgents.length
            ? userSession.userAgents[0].id
            : null;
      }
      const item = await table.files.create(toCreate, { transacting });

      // TODO Comprobar si tenemos algun provedor configurado he intentar subir el archivo con dicho provedor

      // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
      const newPath = pathSys.resolve(__dirname, '..', '..', '..', 'files', item.id);
      await leemons.fs.copyFile(path, newPath);
      return table.files.update({ id: item.id }, { url: newPath }, { transacting });
    },
    table.files,
    _transacting
  );
}

module.exports = { uploadFile };
