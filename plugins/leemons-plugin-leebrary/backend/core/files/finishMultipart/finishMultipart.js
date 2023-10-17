const { LeemonsError } = require('@leemons/error');
const { finishProviderMultipart: handleProviderMultipart } = require('./handleProviderMultipart');
const { getMetadataObject } = require('../upload/getMetadataObject');
const { dataForReturnFile } = require('../dataForReturnFile');
const { createTemp } = require('../upload/createTemp');

/**
 * Finishes multipart upload for a file by handling the provider process and getting
 * metadata for the file.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.fileId - The ID of the file.
 * @param {string} params.path - The path of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} Returns true when finished.
 */
async function finishMultipart({ fileId, path, ctx }) {
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new LeemonsError(ctx, { message: 'No file found' });

  // Finish provider multipart process
  if (file.provider !== 'sys') {
    await handleProviderMultipart({ file, path, ctx });
  }

  // Get metadata for the file and update it in DB
  if (!file.isFolder) {
    const { contentType, readStream } = await dataForReturnFile({ id: fileId, ctx });
    const temp = await createTemp({ readStream, contentType });

    const { metadata } = await getMetadataObject({
      filePath: temp.path,
      fileType: contentType,
      extension: file.extension,
      ctx,
    });
    await ctx.tx.db.Files.findOneAndUpdate({ id: fileId }, { metadata: JSON.stringify(metadata) });
  }

  return true;
}
module.exports = { finishMultipart };
