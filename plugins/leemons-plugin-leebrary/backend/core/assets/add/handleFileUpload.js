const { isEmpty } = require('lodash');
const { uploadFromSource } = require('../../files/helpers/uploadFromSource');

/**
 * Handles the upload of a file and its associated cover.
 * If the provided file is an image, it's set as the cover. If no cover is provided, the cover is uploaded from the source.
 *
 * @async
 * @function
 * @param {Object} params - The parameters object.
 * @param {string} params.file - The file to upload.
 * @param {string | Object} [params.cover] - The cover of the asset. Can be a string or an object.
 * @param {string} params.assetName - The name of the asset.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} An object containing the uploaded file and cover.
 *
 * @example
 * const { newFile, coverFile } = await handleFileUpload({ file: 'fileId', cover: undefined , assetName: 'AssetName', ctx: moleculerContext });
 */
async function handleFileUpload({ file, cover, assetName, ctx }) {
  let newFile = null;
  let coverFile = null;
  if (!isEmpty(file)) {
    newFile = await uploadFromSource({ source: file, name: assetName, ctx });
    if (newFile?.type?.indexOf('image') === 0) {
      coverFile = newFile;
    }
  }

  if (!coverFile && !isEmpty(cover)) {
    coverFile = await uploadFromSource({ source: cover, name: assetName, ctx });
  }
  return { newFile, coverFile };
}

module.exports = { handleFileUpload };
