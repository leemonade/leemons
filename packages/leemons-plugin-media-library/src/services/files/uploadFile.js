const pathSys = require('path');
const { getActiveProvider } = require('../config/getActiveProvider');

async function uploadFile(file, asset, { transacting } = {}) {
  const item = {};
  const { path } = file;

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const providerName = await getActiveProvider({ transacting });
  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.upload) {
      const buffer = await leemons.fs.readFile(path);
      item.provider = providerName;
      item.uri = await provider.services.provider.upload(asset, buffer, { transacting });
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto
  if (item.uri === '') {
    // Generamos la nueva url y copiamos desde la carpeta temporal a la nuestra donde se almacenan todos los archivos
    item.provider = 'sys';
    item.uri = pathSys.resolve(__dirname, '..', '..', '..', 'files', asset.id);
    await leemons.fs.copyFile(path, item.uri);
  }

  return item;
}

module.exports = { uploadFile };
