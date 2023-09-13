const _ = require('lodash');
const { settledResponseToManyResponse } = require('@leemons/utils');
const { add } = require('./add');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {PermissionAdd[]} data - Array of permissions to add
 * @return {Promise<ManyResponse>} Created permissions
 * */
async function addMany({ ctx, ...data }) {
  const response = await Promise.allSettled(_.map(data, (d) => add({ ...d, ctx })));
  return settledResponseToManyResponse(response);
}

module.exports = { addMany };
