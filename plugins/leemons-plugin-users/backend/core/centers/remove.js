/**
 * Remove one center
 * @private
 * @static
 * @param {string} id
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */
async function remove({ _id, soft, ctx }) {
  await ctx.tx.db.Centers.findByIdAndDelete(
    {
      _id,
    },
    { soft }
  );
  return true;
}

module.exports = remove;
