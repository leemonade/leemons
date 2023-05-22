/* eslint-disable no-param-reassign */
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');
const { uploadFromSource } = require('./helpers/uploadFromSource');
const { dataForReturnFile } = require('./dataForReturnFile');
// -----------------------------------------------------------------------------
// MAIN FUNCTIONS

// eslint-disable-next-line camelcase
async function duplicate({ id, created_at, updated_at, ...fileFrom }, { transacting } = {}) {
  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ transacting });
  const urlData = {};

  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.clone) {
      // EN: Firstly save the file to the database and get the id
      // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
      let newFile = await tables.files.create(fileFrom, { transacting });
      urlData.provider = providerName;
      urlData.uri = await provider.services.provider.clone({ id, ...fileFrom }, newFile, {
        transacting,
      });
      newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });
      return newFile;
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto

  const data = await dataForReturnFile(id, { transacting });
  return uploadFromSource(data, { name: fileFrom.name }, { transacting });
}

module.exports = { duplicate };
