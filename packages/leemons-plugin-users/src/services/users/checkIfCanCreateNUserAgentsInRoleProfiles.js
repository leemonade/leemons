const _ = require('lodash');
const { getRolesProfiles } = require('../roles/getRolesProfiles');
const { table } = require('../tables');
const { getRolesCenters } = require('../roles/getRolesCenters');

async function check(nUserAgents, limit, { rolesProfiles, transacting } = {}) {
  if (!limit?.unlimited && limit?.limit) {
    // Si no es ilimitado tenemos que sacar el numero de usuarios actuales
    const { role } = _.find(rolesProfiles, { profile: limit.item });
    const totalUserAgentsForRole = await table.userAgent.count(
      { role, $or: [{ disabled_$null: true }, { disabled: false }] },
      { transacting }
    );
    if (totalUserAgentsForRole + nUserAgents > limit.limit) {
      throw new Error('Cannot add the user exceeds the maximum limit.');
    }
  }
  // Si es ilimitado no comprobamos nada
  return true;
}

async function checkIfCanCreateNUserAgentsInRoleProfiles(nUserAgents, role, { transacting } = {}) {
  const _roles = _.isArray(role) ? role : [role];
  const rolesProfiles = await getRolesProfiles(_roles, { raw: true, transacting });
  const rolesCenters = await getRolesCenters(_roles, { raw: true, transacting });

  const limits = await table.centerLimits.find({
    center_$in: _.map(rolesCenters, 'center'),
    item_$in: _.map(rolesProfiles, 'profile'),
    type: 'profile',
  });

  await Promise.all(
    _.map(limits, (limit) => check(nUserAgents, limit, { rolesProfiles, transacting }))
  );
}

module.exports = { checkIfCanCreateNUserAgentsInRoleProfiles };
