const { isEmpty } = require('lodash');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function count({ params, ctx }) {
  if (params.$or) {
    params.$or = params.$or.filter((item) => !isEmpty(item));
  }

  return ctx.tx.db.ItemPermissions.countDocuments({ ...params });
}

module.exports = { count };
