/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne({ id, ctx }) {
  return ctx.tx.db.ItemPermissions.findOne({ id }).lean();
}

module.exports = { findOne };
