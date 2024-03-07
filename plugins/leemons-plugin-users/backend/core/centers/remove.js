/**
 * Remove one center
 * @private
 * @static
 * @param {string} id
 * @param {any=} _transacting -  DB Transaction
 * @return {Promise<Center>} Created / Updated role
 * */
async function remove({ id, soft, ctx }) {
  await ctx.tx.db.Centers.findByIdAndDelete(
    {
      id,
    },
    { soft }
  );
  return true;
}

module.exports = remove;
