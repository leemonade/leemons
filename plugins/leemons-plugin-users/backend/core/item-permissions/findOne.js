/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function findOne({ _id, ctx }) {
  return ctx.tx.db.ItemPermissions.findOne({ _id }).lean();
}

module.exports = { findOne };
