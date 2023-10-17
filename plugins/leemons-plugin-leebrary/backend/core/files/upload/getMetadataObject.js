const fsPromises = require('fs/promises');

const { handleDocumentInfo } = require('./handleDocumentInfo');
const { handleMediaInfo } = require('./handleMediaInfo');
const { handleMetadata } = require('./handleMetadata');

/**
 * This function centralizes the metadata recolection for a file.
 *
 * @param {object} params - The parameters object.
 * @param {string} params.filePath - The path to the file or a media-file provider URI.
 * @param {string} params.fileType - The file's type.
 * @param {string} params.extension - The file's extension.
 * @param {MoleculerContext} params.ctx - The moleculer context.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the file's metadata and its size
 */
async function getMetadataObject({ filePath, fileType, extension, ctx }) {
  const fileHandle = await fsPromises.open(filePath, 'r');
  const [type] = fileType.split('/');
  // eslint-disable-next-line prefer-const
  let { metadata, fileSize } = await handleMetadata({ fileHandle, path: filePath });
  metadata = await handleMediaInfo({ metadata, fileHandle, fileType: type, fileSize, ctx });
  metadata = await handleDocumentInfo({ metadata, path: filePath, extension });

  return { metadata, fileSize };
}
module.exports = { getMetadataObject };
