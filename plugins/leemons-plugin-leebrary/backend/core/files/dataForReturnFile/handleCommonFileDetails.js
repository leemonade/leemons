const mime = require('mime-types');

/**
 * Get the common file details
 *
 * @param {Object} params - The params object
 * @param {LibraryFile} params.file - The file object
 * @param {string} params.path - The path of the file
 * @returns {Object} The common file details
 */
function handleCommonFileDetails({ file, path }) {
  return {
    file,
    contentType: path ? mime.lookup(path.split('.').reverse()[0]) : file.type,
    fileName: path ? path.split('/').reverse()[0] : `${file.name}.${file.extension}`,
  };
}

module.exports = { handleCommonFileDetails };
