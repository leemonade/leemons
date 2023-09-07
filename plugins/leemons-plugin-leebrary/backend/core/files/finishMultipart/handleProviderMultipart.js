const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Finishes multipart upload for a file if the provider supports it.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file object.
 * @param {string} params.path - The path of the file.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 */
async function finishProviderMultipart({ file, path, ctx }) {
  const provider = await getProviderByName(file.provider);
  if (provider?.supportedMethods?.finishMultipart) {
    await ctx.tx.call(`${file.provider}.provider.finishMultipart`, { file, path });
  }
}

module.exports = { finishProviderMultipart };
