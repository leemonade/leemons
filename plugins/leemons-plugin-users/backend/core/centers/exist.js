/**
 * Return true if exist center with this id, false if not
 * @private
 * @static
 * @param {string} id
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<boolean>}
 * */
async function exist({ _id, ctx }) {
  const exist = await ctx.tx.db.Centers.countDocuments({ _id });
  return !!exist;
}

module.exports = exist;
