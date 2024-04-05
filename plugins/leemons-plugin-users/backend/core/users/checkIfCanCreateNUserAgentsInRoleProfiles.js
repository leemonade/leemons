const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getRolesProfiles } = require('../roles/getRolesProfiles');
const { getRolesCenters } = require('../roles/getRolesCenters');

/**
 * Checks if it is possible to create a number of user agents in a specific role profile.
 *
 * @param {Object} params
 * @param {number} params.nUserAgents - The number of user agents to be created.
 * @param {Object} params.limit - The limit object.
 * @param {Array} params.rolesProfiles - The roles profiles array.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Promise<boolean>} - The result of the check.
 */
async function check({ nUserAgents, limit, rolesProfiles, ctx }) {
  if (!limit.unlimited && limit.limit) {
    // Si no es ilimitado tenemos que sacar el numero de usuarios actuales
    const { role } = _.find(rolesProfiles, { profile: limit.item });
    const totalUserAgentsForRole = await ctx.tx.db.UserAgent.countDocuments({
      role,
      $or: [{ disabled: null }, { disabled: false }],
    });
    if (totalUserAgentsForRole + nUserAgents > limit.limit) {
      throw new LeemonsError(ctx, {
        message: 'Cannot add the user exceeds the maximum limit.',
        httpStatusCode: 400,
      });
    }
  }
  // Si es ilimitado no comprobamos nada
  return true;
}

/**
 * Checks if it is possible to create a number of user agents in a specific role profile.
 *
 * @param {Object} params
 * @param {number} params.nUserAgents - The number of user agents to be created.
 * @param {string} params.role - The role associated with a specific profile and center combination.
 * @param {MoleculerContext} params.ctx - The context object.
 * @throws {LeemonsError} If the user agent cannot be created.
 */
async function checkIfCanCreateNUserAgentsInRoleProfiles({ nUserAgents, role, ctx }) {
  const _roles = _.isArray(role) ? role : [role];
  const rolesProfiles = await getRolesProfiles({ roleIds: _roles, raw: true, ctx });
  const rolesCenters = await getRolesCenters({ roleIds: _roles, raw: true, ctx });

  const limits = await ctx.tx.db.CenterLimits.find({
    center: _.map(rolesCenters, 'center'),
    item: _.map(rolesProfiles, 'profile'),
    type: 'profile',
  });

  await Promise.all(_.map(limits, (limit) => check({ nUserAgents, limit, rolesProfiles, ctx })));
}

module.exports = { checkIfCanCreateNUserAgentsInRoleProfiles };
