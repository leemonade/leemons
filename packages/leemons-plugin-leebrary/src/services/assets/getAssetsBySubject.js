const { map, uniq } = require('lodash');
const { tables } = require('../tables');
const { normalizeItemsArray } = require('../shared');

/**
 * Get assets by subject
 * @param {Array|any} subject - The subject(s)
 * @param {object} options - The options object
 * @param {Array} options.assets - The assets
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of asset IDs
 */
async function getAssetsBySubject(subject, { assets, transacting }) {
  const subjects = normalizeItemsArray(subject);
  const assetsArray = normalizeItemsArray(assets);

  if (!assetsArray.length) {
    return [];
  }

  const query = {
    subject_$in: subjects,
    asset_$in: assetsArray,
  };

  const _assets = await tables.assetsSubjects.find(query, { columns: ['asset'], transacting });
  return uniq(map(_assets, 'asset'));
}

module.exports = { getAssetsBySubject };
