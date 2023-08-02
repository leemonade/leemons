const { LeemonsError } = require('leemons-error');
const validateRole = require('./validateRole');
const { rolesPermissions } = require('../../../config/constants');

/**
 * Retrieves the permissions associated with a given role.
 *
 * @function getRolePermissions
 * @param {Object} options - Input options.
 * @param {string} [options.role='noPermission'] - The role for which to retrieve permissions.
 * @param {import("moleculer").Context} options.ctx - The Moleculer request context.
 * @returns {Object} The permissions associated with the given role.
 * @throws {LeemonsError} If the provided role is not valid.
 */
module.exports = function getRolePermissions({ role = 'noPermission', ctx }) {
  if (validateRole(role)) {
    return rolesPermissions[role];
  }

  throw new LeemonsError(ctx, { message: `The role "${role}" is not valid.`, httpStatusCode: 412 });
};
