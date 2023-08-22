const { isArray, uniq } = require('lodash');
const { getByAssets: getFilesByAssets } = require('../assets/files/getByAssets');
const { getByIds } = require('./getByIds');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Extracts file types from the file objects.
 * @param {Array} files - The files to extract types from.
 * @returns {Array} The extracted file types.
 */
function extractFileTypes(files) {
  return uniq(files.map(({ type }) => type));
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Fetches file types by asset IDs.
 * @param {Array|string} assetIds - The asset IDs.
 * @param {Object} options - The options object.
 * @param {string} options.transacting - The transaction object.
 * @returns {Promise<Array>} The fetched file types.
 */
async function getTypesByAssets(assetIds, { transacting }) {
  const ids = isArray(input) ? input : [input];
  const assetFiles = await getFilesByAssets(ids, { transacting });
  const fileTypes = await getByIds(
    assetFiles.map((item) => item.file),
    { columns: ['type'], transacting }
  );
  return extractFileTypes(fileTypes);
}

module.exports = { getTypesByAssets };
