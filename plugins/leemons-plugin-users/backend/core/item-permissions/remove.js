const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { removeAllItemsCache } = require('./removeAllItemsCache');

/**
 * ES:
 * Elimina los registros que coincidan
 *
 * EN:
 * Deletes matching records
 *
 * @public
 * @static
 * @param {any} query - Delete query
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove({ query, ctx }) {
  let typeKey = null;
  let typeArray = false;
  if (_.isString(query.type)) typeKey = 'type';
  if (_.isArray(query.type)) {
    typeKey = 'type';
    typeArray = true;
  }
  if (_.isRegExp(query.type)) typeKey = 'type';
  if (!typeKey) throw new Error('type param is required');

  if (typeArray) {
    _.forEach(query[typeKey], (key) => {
      validateTypePrefix(key, this.calledFrom);
    });
  } else {
    validateTypePrefix(query[typeKey], this.calledFrom);
  }

  const response = await ctx.tx.db.ItemPermissions.deleteMany(query);
  await removeAllItemsCache();
  return response;
}

module.exports = { remove };
