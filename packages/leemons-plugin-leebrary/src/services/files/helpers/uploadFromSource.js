const { isString } = require('lodash');
const mime = require('mime-types');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
  prepareImage,
} = require('../upload');

/**
 * Handles the upload of a file from a URL.
 * @async
 * @param {string} source - The source URL of the file.
 * @param {Object} data - Source data.
 * @param {Object} options - Additional options.
 * @returns {Promise<Object>} The uploaded file.
 */
async function handleUploadFromUrl(source, data,  options) {
  return await uploadFileFromUrl(source, data, options);
}

/**
 * Handles the upload of a file from a stream.
 * @async
 * @param {Object} source - The source stream of the file.
 * @param {Object} data - Source data.
 * @param {Object} options - Additional options.
 * @returns {Promise<Object>} The uploaded file.
 */
async function handleUploadFromStream(source, data, options) {
  return await uploadFileFromStream(source, data, options);
}

/**
 * Handles the upload of a file from a path.
 * @async
 * @param {Object} source - The source path of the file.
 * @param {Object} data - Source data.
 * @param {Object} options - Additional options.
 * @returns {Promise<Object>} The uploaded file.
 */
async function handleUploadFromPath(source, data, options) {
  const contentType = source.type;
  const [fileType] = contentType.split('/');
  const extension = mime.extension(contentType);
  if (fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
    const imageFile = await prepareImage(source.path, extension);
    return await uploadFile({ ...imageFile, type: contentType }, data, options);
  } else {
    return await uploadFile(source, data, options);
  }
}

/**
 * Uploads a file from a source.
 * @async
 * @param {Object|string} source - The source of the file.
 * @param {Object} data - Source data.
 * @param {string} data.name - The name of the source.
 * @param {Object} options - Additional options.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The uploaded file.
 */
async function uploadFromSource(source, { name }, { transacting } = {}) {
  if (isString(source)) {
    return await handleUploadFromUrl(source, { name }, { transacting });
  } else if (source.readStream) {
    return await handleUploadFromStream(source, { name }, { transacting });
  } else if (source.type && source.path) {
    return await handleUploadFromPath(source, { name }, { transacting });
  }
}

module.exports = { uploadFromSource };
