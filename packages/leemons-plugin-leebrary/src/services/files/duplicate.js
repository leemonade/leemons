/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');
const { uploadFromSource } = require('./helpers/uploadFromSource');
const { dataForReturnFile } = require('./dataForReturnFile');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Clone the file using the provider's clone service.
 * @param {Object} provider - The provider object.
 * @param {Object} fileFrom - The original file object.
 * @param {Object} newFile - The new file object.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} The updated file object.
 */
async function cloneFile(provider, fileFrom, newFile, transacting) {
  const urlData = {
    provider: provider.name,
    uri: await provider.services.provider.clone(fileFrom, newFile, { transacting }),
  };
  return await tables.files.update({ id: newFile.id }, urlData, { transacting });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Duplicate a file.
 * @param {Object} file - The file object to duplicate.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The duplicated file object.
 */
async function duplicate({ id, created_at, updated_at, ...fileFrom }, { transacting } = {}) {
  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ transacting });

  if (providerName) {
    const provider = leemons.getProvider(providerName);
    if (provider?.services?.provider?.clone) {
      // EN: Firstly save the file to the database and get the id
      // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
      const newFile = await tables.files.create(fileFrom, { transacting });
      return await cloneFile(provider, { id, ...fileFrom }, newFile, transacting);
    }
  }

  const data = await dataForReturnFile(id, { transacting });
  return uploadFromSource(data, { name: fileFrom.name }, { transacting });
}

module.exports = { duplicate };
