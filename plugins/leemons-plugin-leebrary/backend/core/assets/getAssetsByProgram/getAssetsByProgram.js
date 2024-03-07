const { map } = require('lodash');
const { normalizeItemsArray } = require('../../shared');

/**
 * Get assets by program
 *
 * @param {object} params - The options object
 * @param {Array|any} params.program - The program(s)
 * @param {Array} params.assets - The asset Ids
 * @param {MoleculerContext} params.ctx - The moleculer context
 * @returns {Promise<Array>} - Returns an array of asset IDs
 */
async function getAssetsByProgram({ program, assets, ctx }) {
  const programs = normalizeItemsArray(program);
  const assetsArray = normalizeItemsArray(assets);

  if (!assetsArray.length) {
    return [];
  }

  const query = {
    program: programs,
    id: assetsArray,
  };

  const _assets = await ctx.tx.db.Assets.find(query).select(['id']).lean();
  return map(_assets, 'id');
}

module.exports = { getAssetsByProgram };
