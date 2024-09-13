const { LeemonsError } = require('@leemons/error');
const https = require('https');

const { dataForReturnFile } = require('../dataForReturnFile');
const { createTemp } = require('../upload/createTemp');
const { getMetadataObject } = require('../upload/getMetadataObject');

const { finishProviderMultipart: handleProviderMultipart } = require('./handleProviderMultipart');

function getStream(url) {
  return new Promise((resolve) => {
    https.get(url, (stream) => {
      resolve(stream);
    });
  });
}

/**
 * Finishes multipart upload for a file by handling the provider process and getting
 * metadata for the file.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.fileId - The ID of the file.
 * @param {string} params.path - The path of the file.
 * @param {string} params.etags - The etags of the parts.
 * @param {boolean} params.skipMetadata - Whether to skip metadata or not.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} Returns true when finished.
 */
async function finishMultipart({ fileId, path, etags, skipMetadata, ctx }) {
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new LeemonsError(ctx, { message: 'No file found' });

  // Finish provider multipart process
  if (file.provider !== 'sys') {
    await handleProviderMultipart({ file, path, etags, ctx });
  }

  // Get metadata for the file and update it in DB
  if (!file.isFolder && !skipMetadata) {
    const { contentType, readStream } = await dataForReturnFile({
      id: fileId,
      ctx,
      forceStream: false,
    });
    const temp = await createTemp({ readStream: await getStream(readStream), contentType });

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
