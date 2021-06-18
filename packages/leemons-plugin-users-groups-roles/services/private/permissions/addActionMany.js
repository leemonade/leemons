const _ = require('lodash');
const { addAction } = require('./addAction');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {string} permissionName - Permission to add action
 * @param {string} actionNames - Actions to add
 * @return {Promise<any>}
 * */
async function addActionMany(permissionName, actionNames) {
  const response = await Promise.allSettled(
    _.map(actionNames, (d) => addAction(permissionName, d))
  );
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { addActionMany };
