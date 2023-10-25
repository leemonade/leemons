const { LeemonsError } = require('@leemons/error');

async function remove({ taskId, ctx }) {
  try {
    // EN: remove the given task.
    // ES: Eliminar la tarea dada.
    // TODO: For now remove all the versions in the same status
    return await ctx.tx.call('assignables.assignables.removeAssignable', {
      assignable: taskId,
      removeAll: 1,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error removing task: ${e.message}`,
    });
  }
}

module.exports = remove;
