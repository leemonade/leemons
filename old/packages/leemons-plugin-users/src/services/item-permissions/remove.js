const _ = require('lodash');
const { validateTypePrefix } = require('../../validations/exists');
const { table } = require('../tables');
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
async function remove(query, { transacting } = {}) {
  let typeKey = null;
  let typeArray = false;
  if (query.type) typeKey = 'type';
  if (query.type_$in) {
    typeKey = 'type_$in';
    typeArray = true;
  }
  if (query.type_$startsWith) typeKey = 'type_$startsWith';
  if (!typeKey) throw new Error('type param is required');

  if (typeArray) {
    _.forEach(query[typeKey], (key) => {
      validateTypePrefix(key, this.calledFrom);
    });
  } else {
    validateTypePrefix(query[typeKey], this.calledFrom);
  }

  const response = await table.itemPermissions.deleteMany(query, { transacting });
  await removeAllItemsCache();
  return response;
}

module.exports = { remove };
