const fs = require('fs/promises');
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Handles the aborting of a multipart upload.
 *
 * @param {Object} params - The params object.
 * @param {LibraryFile} params.file - The file object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 */
async function handleAbortMultipart({ file, ctx }) {
  if (file.provider !== 'sys') {
    const provider = await getProviderByName(file.provider);
    if (provider?.supportedMethods?.abortMultipart) {
      await ctx.call(`${file.provider}.provider.abortMultipart`, { file });
    }
  } else if (file.isFolder) {
    await fs.rmdir(file.uri, { recursive: true });
  } else {
    await fs.unlink(file.uri);
  }
}

module.exports = { handleAbortMultipart };
