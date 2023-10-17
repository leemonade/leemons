const { keyBy, forEach, uniq } = require('lodash');
/**
 * Fetches programs associated with each asset and aggregates them by ID
 * @async
 * @param {Object} params - The params object
 * @param {Array} params.assets - The assets to fetch programs for
 * @param {MoleculerContext} params.ctx - The Moleculer Context object
 * @returns {Promise<Object>} - Returns an object with programs aggregated by ID
 */
async function getAssetsProgramsAggregatedById({ assets, ctx }) {
  let programsById = {};
  const programIds = [];
  forEach(assets, (asset) => {
    if (asset.program) {
      programIds.push(asset.program);
    }
  });

  if (programIds.length) {
    const programs = await ctx.tx.call('academic-portfolio.programs.programsByIds', {
      ids: uniq(programIds),
      onlyProgram: true,
    });
    programsById = keyBy(programs, 'id');
  }

  return programsById;
}
module.exports = { getAssetsProgramsAggregatedById };
