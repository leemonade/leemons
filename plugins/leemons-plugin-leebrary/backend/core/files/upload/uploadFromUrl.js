const { LeemonsError } = require('@leemons/error');
const { getById } = require('../getById');
const { dataForReturnFile } = require('../dataForReturnFile');
const { uploadFromFileStream } = require('./uploadFromFileStream');
const { download } = require('./download');
const { upload } = require('./upload');
/**
 * Uploads a file from a given URL.
 *
 * @param {Object} params - The parames object.
 * @param {string} params.url - The URL of the file to upload.
 * @param {string} params.name - The name of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} A promise that resolves with the uploaded file.
 */
async function uploadFromUrl({ url, name, ctx }) {
  // ES: Primero comprobamos que la URL no sea un FILE_ID
  // EN: First check if the URL is a FILE_ID
  const file = await getById({ id: url, ctx });

  try {
    if (file?.id) {
      if (file.isFolder) {
        return file;
      }
      const fileStream = await dataForReturnFile({ id: file.id, ctx });
      return uploadFromFileStream({ file: fileStream, name, ctx });
    }

    const { path, contentType } = await download({ url, compress: true });
    return upload({ file: { path, type: contentType }, name, ctx });
  } catch (err) {
    ctx.logger.error('ERROR: downloading file:', url);
    // eslint-disable-next-line no-console
    console.dir(url, { depth: null });
    throw new LeemonsError(ctx, { message: `-- ERROR: downloading file ${url} --` });
  }
}

module.exports = { uploadFromUrl };
