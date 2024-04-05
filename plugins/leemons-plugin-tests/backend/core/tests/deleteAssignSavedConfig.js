const { LeemonsError } = require('@leemons/error');

async function deleteAssignSavedConfig({ ctx, id }) {
  try {
    await ctx.tx.db.AssignSavedConfig.deleteOne({
      userAgent: ctx.meta.userSession.userAgents[0].id,
      id,
    });

    return true;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error deleting config ${e.message}`,
    });
  }
}

module.exports = { deleteAssignSavedConfig };
