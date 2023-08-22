const fs = require('fs/promises');
const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches the file from the database.
 * @param {string} fileId - The ID of the file.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} - Returns the file object if found, otherwise throws an error.
 */
async function fetchFile(fileId, transacting) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No file found');
  return dbfile;
}

/**
 * Handles the aborting of a multipart upload.
 * @param {Object} dbfile - The file object.
 * @param {Promise<Object>} transacting - The transaction object.
 */
async function handleAbortMultipart(dbfile, transacting) {
  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.abortMultipart) {
      await provider.services.provider.abortMultipart(dbfile, { transacting });
    }
  } else if (dbfile.isFolder) {
    await fs.rmdir(dbfile.uri, { recursive: true });
  } else {
    await fs.unlink(dbfile.uri);
  }
}

/**
 * Deletes the file from the database.
 * @param {Object} dbfile - The file object.
 * @param {Promise<Object>} transacting - The transaction object.
 */
async function deleteFile(dbfile, transacting) {
  await tables.files.deleteMany({ id: dbfile.id }, { transacting });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Aborts a multipart upload.
 * @param {Object} params - The parameters for the abort.
 * @param {string} params.fileId - The ID of the file.
 * @param {Object} options - The options for the abort.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns true if the abort was successful.
 */
async function abortMultipart({ fileId }, { transacting } = {}) {
  const dbfile = await fetchFile(fileId, transacting);
  await handleAbortMultipart(dbfile, transacting);
  await deleteFile(dbfile, transacting);
  return true;
}

module.exports = { abortMultipart };
