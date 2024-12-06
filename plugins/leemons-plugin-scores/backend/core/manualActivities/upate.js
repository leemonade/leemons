const { validateManualActivity } = require('./validations/validateManualActivity');

async function updateManualActivity({ id, manualActivity, ctx }) {
  validateManualActivity({ manualActivity, ctx });

  const { modifiedCount, matchedCount } = await ctx.tx.db.ManualActivities.updateOne(
    { id },
    manualActivity
  );

  return { modifiedCount, matchedCount };
}

module.exports = updateManualActivity;
