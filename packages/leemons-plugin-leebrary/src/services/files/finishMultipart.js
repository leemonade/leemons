const { tables } = require('../tables');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Fetches the file from the database.
 * @param {string} fileId - The ID of the file.
 * @param {Object} transacting - The transaction object.
 * @returns {Promise<Object>} The file object.
 */
async function fetchFile(fileId, transacting) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No file found');
  return dbfile;
}

/**
 * Finishes multipart upload for a file if the provider supports it.
 * @param {Object} dbfile - The file object.
 * @param {string} path - The path of the file.
 * @param {Promise<Object>} transacting - The transaction object.
 */
async function finishProviderMultipart(dbfile, path, transacting) {
  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.finishMultipart) {
      await provider.services.provider.finishMultipart(dbfile, path, { transacting });
    }
  }
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Finishes multipart upload for a file.
 * @param {Object} params - The parameters object.
 * @param {string} params.fileId - The ID of the file.
 * @param {string} params.path - The path of the file.
 * @param {Object} options - The options object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} Returns true when finished.
 */
async function finishMultipart({ fileId, path }, { transacting } = {}) {
  const dbfile = await fetchFile(fileId, transacting);
  await finishProviderMultipart(dbfile, path, transacting);
  return true;
}

module.exports = { finishMultipart };
