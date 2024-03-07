async function duplicate({ taskId, published, ctx }) {
  try {
    return ctx.tx.call('assignables.assignables.duplicateAssignable', {
      assignableId: taskId,
      published,
    });
  } catch (e) {
    throw new Error(`Error duplicating test: ${e.message}`);
  }
}

module.exports = { duplicate };
