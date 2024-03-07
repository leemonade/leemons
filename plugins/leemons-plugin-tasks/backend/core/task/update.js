const { LeemonsError } = require('@leemons/error');

async function update({ taskId, published, role, ctx, ...data }) {
  try {
    const assignable = await ctx.tx.call('assignables.assignables.updateAssignable', {
      assignable: {
        id: taskId,
        ...data,
      },
    });

    const version = await ctx.tx.call('common.versionControl.parseId', {
      id: assignable.id,
    });

    return { ...assignable, ...version };

    // TODO: Update attachments
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Error updating task: ${error.message}`,
    });
  }
}

module.exports = update;
