const { uniq, map, groupBy } = require('lodash');

/**
 * Retrieves the parent assignables based on the given ids and context.
 *
 * @param {Object} params - The parameters for retrieving the parent assignables.
 * @param {Array} params.ids - The array of ids to filter the parent assignables.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Object} - The parent assignables grouped by asset.
 */
async function getParentAssignables({ ids, ctx }) {
  if (!ids.length) {
    return {};
  }
  const parentAssignables = await ctx.tx.db.Assignables.find({
    $or: ids.map((id) => ({
      'submission.activities.activity': id,
    })),
  })
    .select({ asset: true, submission: true })
    .lean();

  return groupBy(
    parentAssignables.flatMap((parent) => {
      const submission = parent.submission ?? {};
      const activities = uniq(map(submission.activities, 'activity'));

      if (!activities.length) {
        return null;
      }

      return activities.map((activity) => ({
        asset: parent.asset,
        activity,
      }));
    }),
    'asset'
  );
}

module.exports = {
  getParentAssignables,
};
