const { LeemonsError } = require('@leemons/error');

async function publish({ taskId, ctx }) {
  try {
    return await ctx.tx.call('assignables.assignables.publishAssignable', {
      id: taskId,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error publishing task: ${e.message}`,
    });
  }
}

module.exports = publish;
