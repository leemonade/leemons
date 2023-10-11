/**
 * Converts file size to a readable format (KB, MB, GB, etc.).
 *
 * @param {number} size - The file size in bytes.
 * @returns {string} The file size in a readable format.
 */
function getReadableFileSize(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return `${(size / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`;
}
module.exports = { getReadableFileSize };
