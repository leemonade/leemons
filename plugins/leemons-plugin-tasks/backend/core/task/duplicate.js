const { LeemonsError } = require('@leemons/error');

async function duplicate({ taskId, published, ctx }) {
  try {
    return await ctx.tx.call('assignables.assignables.duplicateAssignable', {
      assignableId: taskId,
      published,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error duplicating task: ${e.message}`,
    });
  }
}

module.exports = duplicate;
