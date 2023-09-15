const { getById } = require('../getById');
const { dataForReturnFile } = require('../dataForReturnFile');
/**
 * Uploads a file from a given URL.
 *
 * @param {string} url - The URL of the file to upload.
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.name - The name of the file.
 * @param {Object} options - The options for the upload.
 * @param {Object} options.userSession - The user session object.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Promise<Object>} A promise that resolves with the uploaded file.
 */
async function uploadFromUrl(url, { name }, { userSession, transacting } = {}) {
  // ES: Primero comprobamos que la URL no sea un FILE_ID
  // EN: First check if the URL is a FILE_ID
  const file = await getById(url);

  try {
    if (file?.id) {
      if (file.isFolder) {
        return file;
      }

      const fileStream = await dataForReturnFile(file.id);
      return uploadFromFileStream(fileStream, { name }, { userSession, transacting });
    }

    const { path, contentType } = await download({ url, compress: true });
    return upload({ path, type: contentType }, { name }, { userSession, transacting });
  } catch (err) {
    console.error('ERROR: downloading file:', url);
    console.dir(url, { depth: null });
    throw new Error(`-- ERROR: downloading file ${url} --`);
  }
}

module.exports = { uploadFromUrl };
