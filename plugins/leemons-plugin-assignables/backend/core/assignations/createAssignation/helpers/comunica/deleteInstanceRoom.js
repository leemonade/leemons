async function deleteInstanceRoom({ assignableInstanceId, ctx }) {
  try {
    const key = ctx.prefixPN(`instance:${assignableInstanceId}`);
    await ctx.tx.call('comunica.room.remove', { key });
  } catch (error) {
    console.log(error);
    if (!error.message.endsWith('not exists')) {
      throw error;
    }
  }
}

module.exports = { deleteInstanceRoom };
