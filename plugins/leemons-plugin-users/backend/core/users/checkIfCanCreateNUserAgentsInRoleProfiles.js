const _ = require('lodash');
const { getRolesProfiles } = require('../roles/getRolesProfiles');
const { getRolesCenters } = require('../roles/getRolesCenters');

async function check({ nUserAgents, limit, rolesProfiles, ctx }) {
  if (!limit.unlimited && limit.limit) {
    // Si no es ilimitado tenemos que sacar el numero de usuarios actuales
    const { role } = _.find(rolesProfiles, { profile: limit.item });
    const totalUserAgentsForRole = await ctx.tx.db.UserAgent.countDocuments({
      role,
      $or: [{ disabled: null }, { disabled: false }],
    });
    if (totalUserAgentsForRole + nUserAgents > limit.limit) {
      throw new Error('Cannot add the user exceeds the maximum limit.');
    }
  }
  // Si es ilimitado no comprobamos nada
  return true;
}

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
