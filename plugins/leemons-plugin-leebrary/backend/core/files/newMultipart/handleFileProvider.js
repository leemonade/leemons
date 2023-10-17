/* eslint-disable no-param-reassign */
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Handles the file provider for the given file. If the provider supports multipart operations,
 * it delegates the operation to the provider's newMultipart method.
 *
 * @param {Object} params - The parameters for handling the file provider.
 * @param {LibraryFile} params.file - The file to handle.
 * @param {Array} params.filePaths - The paths of the file.
 * @param {Object} params.settings - The settings for the file provider.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<LibraryFile>} A promise that resolves with the handled file.
 */
async function handleFileProvider({ file, filePaths, settings, ctx }) {
  const provider = await getProviderByName({ name: settings.providerName, ctx });
  file.provider = settings.providerName;

  if (provider?.supportedMethods?.newMultipart) {
    file.uri = await ctx.tx.call(`${file.provider}.files.newMultipart`, { file, filePaths });
  }

  return file;
}

module.exports = { handleFileProvider };
