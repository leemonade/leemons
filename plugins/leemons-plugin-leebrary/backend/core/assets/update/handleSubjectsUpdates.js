const { map } = require('lodash');

/**
 * Handles the asset subjects if necessary.
 * @param {Object} params - The params object
 * @param {string} params.assetId - The ID of the asset.
 * @param {Array} params.subjects - The subjects of the asset.
 * @param {Array} params.diff - The object with differences.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<void>} Resolves when the subjects are handled.
 */
async function handleSubjectsUpdates({ assetId, subjects, diff, ctx }) {
  if (diff.includes('subjects')) {
    await ctx.tx.db.AssetsSubjects.deleteMany({ asset: assetId });
    if (subjects?.length) {
      await Promise.all(
        map(subjects, (item) => ctx.tx.db.AssetsSubjects.create({ asset: assetId, subject: item }))
      );
    }
  }
}
module.exports = { handleSubjectsUpdates };
