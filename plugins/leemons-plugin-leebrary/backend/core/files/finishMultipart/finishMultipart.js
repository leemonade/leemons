const { handleProviderMultipart } = require('./handleProviderMultipart');

/**
 * Finishes multipart upload for a file.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.fileId - The ID of the file.
 * @param {string} params.path - The path of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} Returns true when finished.
 */
async function finishMultipart({ fileId, path, ctx }) {
  const file = await ctx.tx.db.Files.findOne({ id: fileId }).lean();
  if (!file) throw new Error('No file found');

  if (file.provider !== 'sys') {
    await handleProviderMultipart({ file, path, ctx });
  }

  return true;
}
module.exports = { finishMultipart };
