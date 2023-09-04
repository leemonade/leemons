const fsPromises = require('fs/promises');
const { tables } = require('../tables');

/**
 * Handles the upload of a multipart chunk.
 * 
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
  const file = await tables.files.findOne({ id: fileId }, { transacting });
  if (!file) throw new Error('No field found');

  // Reads the chunk data from the provided path and stores it in a buffer. 
  // Then, depending on the file provider, it either uploads the chunk using the provider's service 
  // or appends the chunk data to the file or folder in the system.
  const buffer = await fsPromises.readFile(chunk.path);
  if (file.provider !== 'sys') {
    const provider = leemons.getProvider(file.provider);
    if (provider?.services?.provider?.uploadMultipartChunk) {
      await provider.services.provider.uploadMultipartChunk(file, partNumber, buffer, path, {
        transacting,
      });
    }
  } else if (file.isFolder) {
    await fsPromises.appendFile(`${file.uri}/${path}`, buffer);
  } else {
    await fsPromises.appendFile(file.uri, buffer);
  }

  return true;
}

module.exports = { uploadMultipartChunk };
