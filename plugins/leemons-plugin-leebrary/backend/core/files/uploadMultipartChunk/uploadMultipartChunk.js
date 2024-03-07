const fsPromises = require('fs/promises');
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Handles the upload of a multipart chunk.
 *
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.fileId - The ID of the file.
 * @param {number} params.partNumber - The part number of the chunk.
 * @param {Object} params.chunk - The chunk data.
 * @param {string} params.path - The path of the chunk.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns true if the upload was successful.
 */
async function uploadMultipartChunk({ fileId, partNumber, chunk, path, ctx } = {}) {
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new Error('No file found');

  // Reads the chunk data from the provided path and stores it in a buffer.
  // Then, depending on the file provider, it either uploads the chunk using the provider's service
  // or appends the chunk data to the file or folder in the system.
  const buffer = await fsPromises.readFile(chunk.path);
  if (file.provider !== 'sys') {
    const provider = await getProviderByName({ name: file.provider, ctx });
    if (provider?.supportedMethods?.uploadMultipartChunk) {
      await ctx.tx.call(`${file.provider}.files.uploadMultipartChunk`, {
        file,
        partNumber,
        buffer,
        path,
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
