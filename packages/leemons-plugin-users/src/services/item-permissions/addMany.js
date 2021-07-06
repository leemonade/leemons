const _ = require('lodash');
const add = require('./add');

/**
 * Create multiple item permissions
 * @public
 * @static
 * @param {ItemPermission[]} data - Array of item permissions to add
 * @param {any=} transacting - DB Transaction
 * @param {boolean=} isCustomPermission - If it is a custom permit, it is not checked if it exists in the list of permits.
 * @return {Promise<ManyResponse>} Created permissions
 * */
async function addMany(data, { isCustomPermission, transacting } = {}) {
  const response = await Promise.allSettled(
    _.map(data, (d) =>
      add.call(this, d, {
        isCustomPermission,
        transacting,
      })
    )
  );
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = addMany;
