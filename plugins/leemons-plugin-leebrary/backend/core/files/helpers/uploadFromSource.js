const { isString } = require('lodash');
const mime = require('mime-types');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
  prepareImage,
} = require('../upload');

/**
 * Uploads a file from various sources (URL, readable stream, or file object) and returns the uploaded file details.
 *
 * @async
 * @function uploadFromSource
 * @param {Object} options - Input options.
 * @param {string|stream.Readable|Object} options.source - The source of the file to upload. It can be a URL, a readable stream, or a file object.
 * @param {string} options.name - The name to assign to the uploaded file.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @param {Object} [options.source.readStream] - The readable stream representing the file data (used when the source is a readable stream).
 * @param {string} [options.source.type] - The content type of the file (used when the source is a file object).
 * @param {string} [options.source.path] - The file path (used when the source is a file object).
 * @returns {Promise<Object>} A promise that resolves to an object containing the uploaded file details.
 * @throws {LeemonsError} If the file upload fails or the source is invalid.
 */
async function uploadFromSource({ source, name, ctx }) {
  let resultFile;

  if (isString(source)) {
    resultFile = await uploadFileFromUrl({ url: source, name, ctx });
  } else if (source.readStream) {
    resultFile = await uploadFileFromStream({ file: source, name, ctx });
  } else if (source.type && source.path) {
    const contentType = source.type;
    const [fileType] = contentType.split('/');
    const extension = mime.extension(contentType);
    if (fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
      const imageFile = await prepareImage({ path: source.path, extension, ctx });
      resultFile = await uploadFile({ ...imageFile, type: contentType, name, ctx });
    } else {
      resultFile = await uploadFile({ file: { ...source }, name, ctx });
    }
  }

  return resultFile;
}

module.exports = { uploadFromSource };
