const { getReadableFileSize } = require('./getReadableFileSize');
/**
 * Handles the metadata of a file.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.fileHandle - The file handle.
 * @param {string} params.path - The path of the file.
 * @returns {Promise<Object>} The metadata and size of the file.
 */
async function handleMetadata({ fileHandle, path }) {
  const stats = await fileHandle.stat(path);
  const fileSize = stats.size;
  const metadata = {};

  if (fileSize) {
    metadata.size = getReadableFileSize(fileSize);
  }

  return { metadata, fileSize };
}
module.exports = { handleMetadata };
