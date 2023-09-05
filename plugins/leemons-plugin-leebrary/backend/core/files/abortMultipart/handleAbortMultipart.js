const fs = require('fs/promises');

/**
 * Handles the aborting of a multipart upload.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.file - The file object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 */
async function handleAbortMultipart({ file, ctx }) {
  if (file.provider !== 'sys') {
    const provider = leemons.getProvider(file.provider);
    if (provider?.services?.provider?.abortMultipart) {
      await provider.services.provider.abortMultipart(file);
    }
  } else if (file.isFolder) {
    await fs.rmdir(file.uri, { recursive: true });
  } else {
    await fs.unlink(file.uri);
  }
}

module.exports = { handleAbortMultipart };
