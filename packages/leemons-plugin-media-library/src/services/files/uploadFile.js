const _ = require('lodash');

const pathSys = require('path');
const mime = require('mime-types');
const { table } = require('../tables');
const { getActiveProvider } = require('../config/getActiveProvider');

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

      const providerName = await getActiveProvider({ transacting });
      if (providerName) {
        const provider = leemons.getProvider(providerName);
        if (
          provider &&
          provider.services &&
          provider.services.provider &&
          provider.services.provider.upload
        ) {
          const buffer = await leemons.fs.readFile(path);
          item.provider = providerName;
          item.url = await provider.services.provider.upload(item, buffer, { transacting });
        }
      }

      if (item.url === '') {
        // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
        item.provider = 'sys';
        item.url = pathSys.resolve(__dirname, '..', '..', '..', 'files', item.id);
        await leemons.fs.copyFile(path, item.url);
      }

      return table.files.update({ id: item.id }, item, { transacting });
    },
    table.files,
    _transacting
  );
}

module.exports = { uploadFile };
