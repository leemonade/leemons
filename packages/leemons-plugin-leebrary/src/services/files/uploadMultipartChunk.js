const fsPromises = require('fs/promises');
const { tables } = require('../tables');

/**
 * Handles the upload of a multipart chunk.
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.fileId - The ID of the file.
 * @param {number} params.partNumber - The part number of the chunk.
 * @param {Object} params.chunk - The chunk data.
 * @param {string} params.path - The path of the chunk.
 * @param {Object} options - The options for the upload.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<boolean>} - Returns true if the upload was successful.
 */
async function uploadMultipartChunk({ fileId, partNumber, chunk, path }, { transacting } = {}) {
  const dbfile = await tables.files.findOne({ id: fileId }, { transacting });
  if (!dbfile) throw new Error('No field found');

  const buffer = await fsPromises.readFile(chunk.path);
  if (dbfile.provider !== 'sys') {
    const provider = leemons.getProvider(dbfile.provider);
    if (provider?.services?.provider?.uploadMultipartChunk) {
      await provider.services.provider.uploadMultipartChunk(dbfile, partNumber, buffer, path, {
        transacting,
      });
    }
  } else if (dbfile.isFolder) {
    await fsPromises.appendFile(`${dbfile.uri}/${path}`, buffer);
  } else {
    await fsPromises.appendFile(dbfile.uri, buffer);
  }
  return true;
}

module.exports = { uploadMultipartChunk };
