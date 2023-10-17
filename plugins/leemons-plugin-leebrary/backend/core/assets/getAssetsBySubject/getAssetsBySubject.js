const { map, uniq } = require('lodash');
const { normalizeItemsArray } = require('../../shared');

/**
 * Get assets by subject
 * @param {Object} params - The parameters object
 * @param {Array|any} params.subject - The subject(s)
 * @param {Array} params.assets - The assets
 * @param {MoleculerContext} params.ctx - The Moleculer context
 * @returns {Promise<Array>} - Returns an array of asset IDs
 */
async function getAssetsBySubject({ subject, assets, ctx }) {
  const subjects = normalizeItemsArray(subject);
  const assetsArray = normalizeItemsArray(assets);

  if (!assetsArray.length) {
    return [];
  }

  const query = {
    subject: subjects,
    asset: assetsArray,
  };
  const _assets = await ctx.tx.db.AssetsSubjects.find(query).select(['asset']).lean();
  return uniq(map(_assets, 'asset'));
}

module.exports = { getAssetsBySubject };
