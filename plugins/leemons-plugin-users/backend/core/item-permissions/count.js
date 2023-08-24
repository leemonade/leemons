/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function count({ params, ctx }) {
  console.log('params count', params);
  return ctx.tx.db.ItemPermissions.countDocuments({ ...params });
}

module.exports = { count };
