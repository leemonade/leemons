const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { validateTypePrefix } = require('../../validations/exists');
const { removeAllItemsCache } = require('./removeAllItemsCache');

/**
 * ES:
 * Elimina los registros que coincidan
 *
 * EN:
 * Deletes matching records
 *
 * @param {Object} options - Input options.
 * @param {Object} options.query - The query to specify which item permissions to remove.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Promise<Object>} The response after removing the item permissions.
 * @throws {LeemonsError} If the type param is missing or invalid.
 */
async function remove({ query, ctx }) {
  let typeKey = null;
  let typeArray = false;
  if (_.isString(query.type)) typeKey = 'type';
  if (_.isArray(query.type)) {
    typeKey = 'type';
    typeArray = true;
  }
  if (_.isRegExp(query.type)) typeKey = 'type';
  if (!typeKey) throw new LeemonsError(ctx, { message: 'type param is required' });

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
