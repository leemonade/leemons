const mime = require('mime-types');
const pathSys = require('path');
const { files } = require('../tables');
const { getActiveProvider } = require('../config/getActiveProvider');

async function uploadFile(file, data, { transacting } = {}) {
  const item = {};
  const { path, type } = file;
  const extension = mime.extension(type);

  let fileObj = {
    provider: 'sys',
    name: data.name,
    type,
    extension,
    uri: '',
  };

  // EN: Firstly save the file to the database and get the id
  // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
  fileObj = await files.create(fileObj, { transacting });

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const providerName = await getActiveProvider({ transacting });

  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await leemons.fs.readFile(path);
      item.provider = providerName;

      item.uri = await provider.services.provider.upload(fileObj, buffer, { transacting });
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto
  if (item.uri === '') {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    item.provider = 'sys';
    item.uri = pathSys.resolve(__dirname, '..', '..', '..', 'files', fileObj.id);
    await leemons.fs.copyFile(path, item.uri);
  }

  // EN: Update the asset with the new URI and provider
  // ES: Actualizamos el archivo con la nueva URI y proveedor
  fileObj = await files.update({ id: fileObj.id }, item, { transacting });

  return fileObj;
}

module.exports = { uploadFile };
