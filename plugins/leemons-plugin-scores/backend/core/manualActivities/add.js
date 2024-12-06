const { validateManualActivity } = require('./validations/validateManualActivity');

async function addManualActivity({ manualActivity, ctx }) {
  validateManualActivity({ manualActivity, ctx });

  const { id } = await ctx.tx.db.ManualActivities.create(manualActivity);

  return id;
}

module.exports = addManualActivity;
