const { createTemp } = require('./createTemp');
const { upload } = require('./upload');
/**
 * Uploads a file from a given file stream.
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file stream to upload.
 * @param {string} params.name - The name of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context object.
 * @returns {Promise<Object>} A promise that resolves with the uploaded file.
 */
async function uploadFromFileStream({ file, name, ctx }) {
  const { readStream, contentType } = file;
  const { path } = await createTemp({ readStream, contentType });

  return upload({ file: { path, type: contentType }, name, ctx });
}
module.exports = { uploadFromFileStream };
