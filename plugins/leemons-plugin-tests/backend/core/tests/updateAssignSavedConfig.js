const { LeemonsError } = require('@leemons/error');

async function updateAssignSavedConfig({ ctx, name, config, id }) {
  try {
    await ctx.tx.db.AssignSavedConfig.findOneAndUpdate(
      {
        userAgent: ctx.meta.userSession.userAgents[0].id,
        id,
      },
      {
        name,
        config: JSON.stringify(config),
      }
    );

    return true;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error updating config ${e.message}`,
    });
  }
}

module.exports = { updateAssignSavedConfig };
