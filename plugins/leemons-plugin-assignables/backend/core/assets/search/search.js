const _ = require('lodash');

const { searchAssignables } = require('../../assignables/searchAssignables');
const { getAssignablesAssets } = require('../../assignables/getAssignablesAssets');

/**
 * This function performs a search operation based on the provided parameters.
 * It retrieves assignables based on the criteria, query, category, assets, published status, and preference.
 *
 * @param {object} params - The params object.
 * @param {object} params.criteria - The criteria for the search.
 * @param {object} params.query - The query for the search.
 * @param {object} params.category - The category of the assets.
 * @param {Array<string>} params.assets - The IDs of the assets to search for.
 * @param {boolean} params.published - The published status of the assets.
 * @param {boolean} params.preferCurrent - Preference for current assets.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array<string>>} - Returns an array of asset IDs that match the search criteria.
 */
async function search({
  criteria,
  query,
  category,
  assets: assetsIds,
  published,
  preferCurrent,
  ctx,
}) {
  const role = category.key.replace('assignables.', '');

  const assignablesIds = await searchAssignables({
    roles: role,
    data: {
      published,
      preferCurrent,
      search: criteria,
      subjects: query?.subjects,
      program: query?.program,
    },
    ctx,
  });

  const assets = await getAssignablesAssets({ ids: assignablesIds, ctx });

  if (assetsIds?.length) {
    return _.intersection(Object.values(assets), assetsIds);
  }
  return Object.values(assets);
}

module.exports = { search };
