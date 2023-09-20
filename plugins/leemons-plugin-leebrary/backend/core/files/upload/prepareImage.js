const temp = require('temp');
const { getOptimizedImage } = require('./getOptimizedImage');
/**
 * Creates a temporary file from an image and optimizes it.
 *
 * @param {Object} params - The params object
 * @param {string} params.path - The path of the image.
 * @param {string} params.extension - The extension of the image.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} A promise that resolves with an object containing the path of the temporary file.
 */
async function prepareImage({ path, extension, ctx }) {
  try {
    const fileWriterStream = temp.createWriteStream();

    await new Promise((resolve, reject) => {
      fileWriterStream.on('error', reject).on('finish', resolve);
      getOptimizedImage({ path, extension }).pipe(fileWriterStream);
    });

    return { path: fileWriterStream.path };
  } catch (error) {
    ctx.logger.error('Error uploading image:', error);
    throw error;
  }
}

module.exports = { prepareImage };
