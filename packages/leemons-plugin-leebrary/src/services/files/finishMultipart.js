/* eslint-disable no-param-reassign */
const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Finishes multipart upload for a file if the provider supports it.
 * 
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file object.
 * @param {string} params.path - The path of the file.
 * @param {Promise<Object>} transacting - The transaction object.
 */
async function finishProviderMultipart({ file, path, transacting }) {
  const provider = leemons.getProvider(file.provider);
  if (provider?.services?.provider?.finishMultipart) {
    await provider.services.provider.finishMultipart(file, path, { transacting });
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Finishes multipart upload for a file.
 * 
 * @param {Object} params - The parameters object.
 * @param {string} params.fileId - The ID of the file.
 * @param {string} params.path - The path of the file.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} Returns true when finished.
 */
async function finishMultipart({ fileId, path }, { transacting } = {}) {
  const file = await tables.files.findOne({ id: fileId }, { transacting });
  if (!file) throw new Error('No file found');

  if (file.provider !== 'sys') {
    await finishProviderMultipart({ file, path, transacting })
  }

  return true;
}

module.exports = { finishMultipart };
