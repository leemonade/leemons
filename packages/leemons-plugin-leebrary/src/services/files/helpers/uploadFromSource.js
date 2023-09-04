const { isString } = require('lodash');
const mime = require('mime-types');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
  prepareImage,
} = require('../upload');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Handles the upload of a file from a given path.
 *
 * @param {Object} params - The parameters for the upload.
 * @param {Object} params.source - The source of the file, containing type and path.
 * @param {string} params.name - The name of the file.
 * @param {Object} params.transacting - The transaction object.
 * @returns {Promise<Object>} The uploaded file.
 */
async function handleUploadFromPath({ source, name, transacting }) {
  const contentType = source.type;
  const [fileType] = contentType.split('/');
  const extension = mime.extension(contentType);

  if (fileType === 'image' && ['jpeg', 'jpg', 'png'].includes(extension)) {
    const imageFile = await prepareImage({ path: source.path, extension });
    return uploadFile({ ...imageFile, type: contentType }, { name }, { transacting });
  }
  return uploadFile(source, { name }, { transacting });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Uploads a file from a source.
 *
 * @async
 * @param {Object|string} source - The source of the file.
 * @param {Object} data - Source data.
 * @param {string} data.name - The name of the source.
 * @param {Object} options - Additional options.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} The uploaded file.
 */
async function uploadFromSource(source, { name }, { transacting } = {}) {
  let resultFile;

  if (isString(source)) {
    resultFile = await uploadFileFromUrl(source, { name }, { transacting });
  }
  //
  else if (source.readStream) {
    resultFile = await uploadFileFromStream(source, { name }, { transacting });
  }
  //
  else if (source.type && source.path) {
    resultFile = await handleUploadFromPath({ source, name, transacting });
  }

  return resultFile;
}

module.exports = { uploadFromSource };
