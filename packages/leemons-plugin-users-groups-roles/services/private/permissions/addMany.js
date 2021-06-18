const _ = require('lodash');

/**
 * Create multiple permissions
 * @public
 * @static
 * @param {PermissionAdd[]} data - Array of permissions to add
 * @return {Promise<ManyResponse>} Created permissions
 * */
async function addMany(data) {
  const response = await Promise.allSettled(
    _.map(data, (d) => leemons.plugin.services.permissions.add(d))
  );
  return global.utils.settledResponseToManyResponse(response);
}

module.exports = { addMany };
