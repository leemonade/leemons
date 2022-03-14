const mime = require('mime-types');
const pathSys = require('path');
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');

async function upload(file, { name }, { userSession, transacting } = {}) {
  const { path, type } = file;
  const extension = mime.extension(type);

  const fileData = {
    provider: 'sys',
    name,
    type,
    extension,
    uri: '',
  };

  if (userSession) {
    fileData.fromUser = userSession.id;
    fileData.fromUserAgent =
      userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  }

  // EN: Firstly save the file to the database and get the id
  // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
  let newFile = await tables.files.create(fileData, { transacting });

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ transacting });
  const urlData = {};

  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await leemons.fs.readFile(path);
      urlData.provider = providerName;

      urlData.uri = await provider.services.provider.upload(newFile, buffer, { transacting });
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto
  if (urlData.uri === '') {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    urlData.provider = 'sys';
    urlData.uri = pathSys.resolve(__dirname, '..', '..', '..', 'files', newFile.id);
    await leemons.fs.copyFile(path, urlData.uri);
  }

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });

  return newFile;
}

module.exports = { upload };
