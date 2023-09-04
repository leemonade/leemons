/* eslint-disable no-param-reassign */
const { tables } = require('../tables');
const { findOne: getSettings } = require('../settings');
const { uploadFromSource } = require('./helpers/uploadFromSource');
const { dataForReturnFile } = require('./dataForReturnFile');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Clones the file using the provider's clone service. 
 * 
 * @param {Object} params - The parameters object.
 * @param {Object} params.fromFile - The original file object.
 * @param {String} params.providerName - The name of the provider.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} The updated file object.
 */
async function handleCloneFile({ fromFile, providerName, transacting }) {
  const provider = leemons.getProvider(providerName);
  const urlData = {};
  let newFile;
  if (provider?.services?.provider?.clone) {
    // EN: Firstly save the file to the database and get the id
    // ES: Primero guardamos el archivo en la base de datos y obtenemos el id
    newFile = await tables.files.create(fromFile, { transacting });
    urlData.provider = providerName;
    urlData.uri = await provider.services.provider.clone(fromFile, newFile, {
      transacting,
    });
    newFile = await tables.files.update({ id: newFile.id }, urlData, { transacting });
  }
  return newFile;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Duplicates a file by creating a new file with the same content.
 * 
 * @param {Object} file - The file object to duplicate.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The duplicated file object.
 */
async function duplicate(file, { transacting } = {}) {
  // eslint-disable-next-line camelcase
  const { created_at, updated_at, ...fromFile } = file;

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ transacting });

  if (providerName) {
    const newFile = await handleCloneFile({ fromFile, providerName, transacting });
    if (newFile) {
      return newFile;
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto

  const data = await dataForReturnFile(fromFile.id, { transacting });
  return uploadFromSource(data, { name: fromFile.name }, { transacting });
}

module.exports = { duplicate };
