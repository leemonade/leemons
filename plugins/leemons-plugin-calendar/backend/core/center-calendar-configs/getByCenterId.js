/**
 *
 * @public
 * @static
 * @param {any} center - Center id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getByCenterId({ center, ctx }) {
  return ctx.tx.db.CenterCalendarConfigs.findOne({ center }).lean();
}

module.exports = { getByCenterId };
