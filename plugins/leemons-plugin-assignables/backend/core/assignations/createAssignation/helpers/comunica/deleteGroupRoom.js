async function deleteGroupRoom({ assignableInstanceId, ctx }) {
  const key = ctx.prefixPN(`instance:${assignableInstanceId}:group`);
  try {
    await ctx.tx.call('comunica.room.remove', { key });
  } catch (error) {
    console.log(error);
    if (!error.message.endsWith('not exists')) {
      throw error;
    }
  }
}

module.exports = { deleteGroupRoom };
