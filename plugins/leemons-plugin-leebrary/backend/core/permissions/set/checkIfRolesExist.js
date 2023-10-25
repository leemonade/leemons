const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const validateRole = require('../helpers/validateRole');

/**
 * This function checks if the roles are valid.
 * @param {Object} params - The parameters for the function.
 * @param {Array} params.canAccess - The array of userAgents that can access the asset.
 * @param {Object} params.permissions - The permissions object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @throws {LeemonsError} If the role is invalid.
 */
function checkIfRolesExist({ canAccess, permissions, ctx }) {
  const roles = [];
  if (canAccess.length) {
    roles.push(..._.map(canAccess, 'role'));
  }
  if (permissions) {
    roles.push(...Object.keys(permissions));
  }

  _.forEach(_.uniq(roles), (role) => {
    if (!validateRole(role)) {
      throw new LeemonsError(ctx, { message: `Invalid role: ${role}}`, httpStatusCode: 412 });
    }
  });
}
module.exports = { checkIfRolesExist };
