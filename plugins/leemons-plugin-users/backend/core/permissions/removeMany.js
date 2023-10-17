const _ = require('lodash');
const { settledResponseToManyResponse } = require('@leemons/utils');

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
      ctx.tx.call('users.permissions.remove', { permissionName })
    )
  );
  return settledResponseToManyResponse(response);
}

module.exports = { removeMany };
