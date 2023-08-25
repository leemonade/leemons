const { map } = require('lodash');
const { tables } = require('../tables');
const { normalizeItemsArray } = require('../shared');

/**
 * Get assets by program
 *
 * @param {Array|any} program - The program(s)
 * @param {object} options - The options object
 * @param {Array} options.assets - The assets
 * @param {object} options.transacting - The transaction object
 * @returns {Promise<Array>} - Returns an array of asset IDs
 */
async function getAssetsByProgram(program, { assets, transacting }) {
  const programs = normalizeItemsArray(program);
  const assetsArray = normalizeItemsArray(assets);

  if (!assetsArray.length) {
    return [];
  }

  const query = {
    program_$in: programs,
    id_$in: assetsArray,
  };

  const _assets = await tables.assets.find(query, { columns: ['id'], transacting });
  return map(_assets, 'id');
}

module.exports = { getAssetsByProgram };
