async function unregisterClass({ instance, id, ctx }) {
  const ids = Array.isArray(id) ? id : [id].filter(Boolean);

  // TODO: Check if user has edition permissions
  const { deletedCount } = await ctx.tx.db.Classes.deleteMany({
    assignableInstance: instance,
    class: ids,
  });

  return deletedCount;
}

module.exports = { unregisterClass };
