const { isArray } = require('lodash');
const { tables } = require('../../tables');

/**
 * Get the files associated with multiple files
 * 
 * @param {Array|string} fileIds - The IDs of the files
 * @param {object} options - The options object
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of files
 */
async function getByFiles(fileIds, { transacting } = {}) {
  const ids = isArray(fileIds) ? fileIds : [fileIds];
  return tables.assetsFiles.find(
    {
      file_$in: ids,
    },
    { transacting }
  );
}

module.exports = { getByFiles };
