/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function count({ params, ctx }) {
  return ctx.tx.db.ItemPermissions.countDocuments({ ...params });
}

module.exports = { count };
