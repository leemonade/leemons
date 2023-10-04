const fs = require('fs');
const { getByName: getProviderByName } = require('../../providers/getByName');

/**
 * Get the read stream for the file
 *
 * @param {Object} params - The params object
 * @param {LibraryFile} params.file - The file object
 * @param {string} params.path - The path of the file
 * @param {Object} params.readParams - The read parameters
 * @param {number} params.bytesStart - The start byte
 * @param {number} params.bytesEnd - The end byte
 * @param {boolean} params.forceStream - The force stream flag
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object|null>} The read stream
 */
async function handleReadStream({
  file,
  path,
  readParams,
  bytesStart,
  bytesEnd,
  forceStream,
  ctx,
} = {}) {
  let readStream = null;

  // Default provider
  if (file.provider === 'sys') {
    readStream = fs.createReadStream(file.uri + (path ? `/${path}` : ''), readParams);
  } else {
    // Other providers
    const provider = await getProviderByName({ name: file.provider, ctx });
    if (provider?.supportedMethods?.getReadStream) {
      readStream = await ctx.tx.call(`${file.provider}.files.getReadStream`, {
        key: file.uri + (path ? `/${path}` : ''),
        start: bytesStart,
        end: bytesEnd,
        forceStream,
      });
    }
  }

  return readStream;
}

module.exports = { handleReadStream };
