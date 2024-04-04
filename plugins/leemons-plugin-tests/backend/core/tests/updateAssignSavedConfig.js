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
    ).lean();

    return true;
  } catch (e) {
    throw new Error('Error updating config', e.message);
  }
}

module.exports = { updateAssignSavedConfig };
