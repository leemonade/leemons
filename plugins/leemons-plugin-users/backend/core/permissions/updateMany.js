const _ = require('lodash');
const { settledResponseToManyResponse } = require('@leemons/utils');
const { update } = require('./update');

/**
 * Update multiple permissions
 * @public
 * @static
 * @param {PermissionAdd[]} data - Array of permissions to update
 * @return {Promise<ManyResponse>} Updated permissions
 * */
async function updateMany({ ctx, ...data }) {
  const response = await Promise.allSettled(_.map(data, (d) => update({ ...d, ctx })));
  return settledResponseToManyResponse(response);
}

module.exports = { updateMany };
