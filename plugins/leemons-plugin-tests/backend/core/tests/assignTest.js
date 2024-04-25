/* eslint-disable no-param-reassign */

async function assignTest({ id, data, ctx }) {
  const { userSession } = ctx.meta;

  const assignable = await ctx.tx.call('assignables.assignables.getAssignable', { id });

  if (!data.metadata?.questions) {
    data.metadata.questions = assignable.metadata?.questions;
  }

  if (data.metadata.filters.useAdvancedSettings) {
    if (data.metadata.filters.settings === 'new') {
      if (data.metadata.filters.presetName) {
        await ctx.tx.db.AssignSavedConfig.create({
          config: JSON.stringify(data.metadata.filters),
          name: data.metadata.filters.presetName,
          userAgent: userSession.userAgents[0].id,
        });
      }
    } else {
      const config = await ctx.tx.db.AssignSavedConfig.findOne({
        id: data.metadata.filters.configSelected,
      }).lean();
      data.metadata.filters = JSON.parse(config.config || null);
    }
  }

  return ctx.tx.call('assignables.assignableInstances.createAssignableInstance', {
    assignableInstance: {
      assignable: assignable.id,
      ...data,
    },
  });
}

module.exports = { assignTest };
