const _ = require('lodash');
const fs = require('fs');
const pathSys = require('path');
const mime = require('mime-types');
const { table } = require('../tables');

async function uploadFile(file, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { path, name, type } = file;
      const extension = mime.extension(type);

      // ES: Creamos temporalmente el archivo para asi tener la id que usaremos de nombre
      const item = await table.files.create(
        {
          provider: 'sys',
          type,
          extension,
          name: name.replace(`.${extension}`),
          url: '',
        },
        { transacting }
      );

      // TODO Comprobar si tenemos algun provedor configurado he intentar subir el archivo con dicho provedor

      // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
      const newPath = pathSys.resolve(__dirname, '..', '..', '..', 'files', item.id);
      // TODO Dar permisos desde al VM a este plugin para que pueda copiar archivos
      const a = await fs.copyFile(path, newPath);
      console.log(a, newPath);
    },
    table.files,
    _transacting
  );
}

module.exports = { uploadFile };
