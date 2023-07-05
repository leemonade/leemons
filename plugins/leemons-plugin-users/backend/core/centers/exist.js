/**
 * Return true if exist center with this id, false if not
 * @private
 * @static
 * @param {string} id
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<boolean>}
 * */
async function exist({ id, ctx }) {
  const exist = await ctx.tx.db.Centers.countDocuments({ id });
  return !!exist;
}

module.exports = exist;
