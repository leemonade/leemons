const { findOne: getSettings } = require('../../settings');
const { uploadFromSource } = require('../helpers/uploadFromSource');
const { dataForReturnFile } = require('../dataForReturnFile');
const { handleCloneFile } = require('./handleCloneFile');

/**
 * Duplicates a file by creating a new file with the same content.
 *
 * @param {Object} params - The options object.
 * @param {Object} params.file - The file object to duplicate.
 * @param {MoleculerContext} params.ctx - The moleculer context object.
 * @returns {Promise<Object>} The duplicated file object.
 */
async function duplicate({ file, ctx } = {}) {
  // eslint-disable-next-line camelcase
  const { created_at, updated_at, ...fromFile } = file;

  // EN: Use active provider
  // ES: Usar el proveedor activo
  const { providerName } = await getSettings({ ctx });

  if (providerName) {
    const newFile = await handleCloneFile({ fromFile, providerName, ctx });
    if (newFile) {
      return newFile;
    }
  }

  // EN: If no provider is active, use the default one
  // ES: Si no hay proveedor activo, usar el por defecto

  const data = await dataForReturnFile({ id: fromFile.id, ctx });
  return uploadFromSource({ source: data, name: fromFile.name, ctx });
}

module.exports = { duplicate };
