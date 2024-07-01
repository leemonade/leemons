const { LeemonsError } = require('@leemons/error');

async function createAssignSavedConfig({ ctx, name, config }) {
  try {
    const { id } = await ctx.tx.db.AssignSavedConfig.create({
      name,
      config: JSON.stringify(config),
      userAgent: ctx.meta.userSession.userAgents[0].id,
    });

    return id;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error creating config ${e.message}`,
    });
  }
}

module.exports = { createAssignSavedConfig };
