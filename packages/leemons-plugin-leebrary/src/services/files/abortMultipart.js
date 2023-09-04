/* eslint-disable no-param-reassign */
const fs = require('fs/promises');
const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Handles the aborting of a multipart upload.
 * 
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file object.
 * @param {Object} params.transacting - The transaction object.
 */
async function handleAbortMultipart({ file, transacting }) {
  if (file.provider !== 'sys') {
    const provider = leemons.getProvider(file.provider);
    if (provider?.services?.provider?.abortMultipart) {
      await provider.services.provider.abortMultipart(file, { transacting });
    }
  } else if (file.isFolder) {
    await fs.rmdir(file.uri, { recursive: true });
  } else {
    await fs.unlink(file.uri);
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Aborts a multipart upload.
 * 
 * @param {Object} params - The parameters for the abort.
 * @param {string} params.fileId - The ID of the file.
 * @param {Object} options - The options for the abort.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns true if the abort was successful.
 */
async function abortMultipart({ fileId }, { transacting } = {}) {
  // Fetches the file from the database.
  const file = await tables.files.findOne({ id: fileId }, { transacting });
  if (!file) throw new Error('No file found');

  await handleAbortMultipart({ file, transacting });

  // Deletes the file from the database.
  await tables.files.deleteMany({ id: file.id }, { transacting });

  return true;
}

module.exports = { abortMultipart };
