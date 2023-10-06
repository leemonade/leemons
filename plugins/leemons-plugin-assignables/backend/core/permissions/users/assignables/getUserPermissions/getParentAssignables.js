const { uniq, map, groupBy } = require('lodash');

async function getParentAssignables({ ids, ctx }) {
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
