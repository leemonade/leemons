/**
 *
 * @public
 * @static
 * @param {any} configId - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeByConfigId({ configId, ctx }) {
  return ctx.tx.db.CenterCalendarConfigs.deleteMany({ config: configId });
}

module.exports = { removeByConfigId };
