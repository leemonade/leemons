const _ = require('lodash');
const { addAction } = require('./addAction');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {string} permissionName - Permission to add action
 * @param {string[]} actionNames - Actions to add
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addActionMany(permissionName, actionNames, { transacting }) {
  const response = await Promise.allSettled(
    _.map(actionNames, (d) => addAction.call(this, permissionName, d, { transacting }))
  );
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { addActionMany };
