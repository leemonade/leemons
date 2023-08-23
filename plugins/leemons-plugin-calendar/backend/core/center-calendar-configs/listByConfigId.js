/**
 *
 * @public
 * @static
 * @param {any} config - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function listByConfigId({ config, ctx }) {
  return ctx.tx.db.CenterCalendarConfigs.find({ config }).lean();
}

module.exports = { listByConfigId };
