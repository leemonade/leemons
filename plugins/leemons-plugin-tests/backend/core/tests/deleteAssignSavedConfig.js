async function deleteAssignSavedConfig({ ctx, id }) {
  try {
    await ctx.tx.db.AssignSavedConfig.deleteOne({
      userAgent: ctx.meta.userSession.userAgents[0].id,
      id,
    }).lean();

    return true;
  } catch (e) {
    throw new Error('Error deleting config', e.message);
  }
}

module.exports = { deleteAssignSavedConfig };
