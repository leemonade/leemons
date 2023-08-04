const _ = require('lodash');
const { settledResponseToManyResponse } = require('leemons-utils');
const { remove } = require('./remove');

/**
 * Delete multiple permissions
 * @public
 * @static
 * @param {string[]} permissionNames - Array of permissions to delete
 * @return {Promise<ManyResponse>} Deleted permissions
 * */
async function removeMany({ permissionNames, ctx }) {
  const response = await Promise.allSettled(
    _.map(permissionNames, (permissionName) =>
      ctx.tx.call('users.permissions.remove', { permissionName, ctx })
    )
  );
  return settledResponseToManyResponse(response);
}

module.exports = { removeMany };
