const _ = require('lodash');

/**
 * Retrieves the centers associated with given role IDs. It can return either raw data about the role-center associations or just the center IDs based on the `raw` flag.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string[] | string} params.roleIds - An array of role IDs for which the centers are to be fetched.
 * @param {boolean} params.raw - A boolean flag that determines the format of the returned data. If `true`, returns the complete role-center association data. If `false`, returns only the center IDs.
 * @param {Object} params.ctx - The context object, which includes the database transaction context.
 * @returns {Promise<Array<Object> | Array<string>>} - Depending on the `raw` flag, either an array of role-center association objects or an array of center IDs.
 */
async function getRolesCenters({ roleIds, raw, ctx }) {
  const centerRoles = await ctx.tx.db.RoleCenter.find({ role: roleIds })
    .select(['id', 'center', 'role'])
    .lean();
  if (raw) return centerRoles;
  return _.map(centerRoles, 'center');
}

module.exports = { getRolesCenters };
