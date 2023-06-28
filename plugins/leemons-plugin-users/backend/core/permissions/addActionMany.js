const _ = require('lodash');
const { settledResponseToManyResponse } = require('leemons-utils');
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
async function addActionMany({ permissionName, actionNames, ctx }) {
  const response = await Promise.allSettled(
    _.map(actionNames, (d) => addAction({ permissionName, actionName: d, ctx }))
  );
  return settledResponseToManyResponse(response);
}

module.exports = { addActionMany };
