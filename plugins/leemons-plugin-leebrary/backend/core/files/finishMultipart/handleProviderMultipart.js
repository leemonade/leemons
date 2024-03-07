const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Finishes multipart upload for a file if the provider supports it.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file object.
 * @param {string} params.path - The path of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 */
async function finishProviderMultipart({ file, path, etags, ctx }) {
  const provider = await getProviderByName({ name: file.provider, ctx });
  if (provider?.supportedMethods?.finishMultipart) {
    await ctx.tx.call(`${file.provider}.files.finishMultipart`, { file, etags, path });
  }
}

module.exports = { finishProviderMultipart };
