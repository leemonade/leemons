const _ = require('lodash');
const { table } = require('../tables');
const { getRolesCenters } = require('../roles/getRolesCenters');
const { getRolesProfiles } = require('../roles/getRolesProfiles');

async function addCenterProfilePermissionToUserAgents(
  userAgentIds,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        const userAgents = await table.userAgent.find(
          {
            id_$in: _.isArray(userAgentIds) ? userAgentIds : [userAgentIds],
          },
          { transacting }
        );

        const roleIds = _.map(userAgents, 'role');
        const rolesCenters = await getRolesCenters(roleIds, { raw: true, transacting });
        const rolesProfiles = await getRolesProfiles(roleIds, { raw: true, transacting });
        const rolesCentersByRole = _.keyBy(rolesCenters, 'role');
        const rolesProfilesByRole = _.keyBy(rolesProfiles, 'role');

        // Centers
        await Promise.allSettled(
          _.map(userAgents, (userAgent) => {
            if (rolesCentersByRole[userAgent.role]?.center) {
              return leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
                userAgent.id,
                {
                  permissionName: `plugins.users.center.inside.${
                    rolesCentersByRole[userAgent.role].center
                  }`,
                  actionNames: ['view'],
                },
                { throwIfExists: false, transacting }
              );
            }
            return null;
          })
        );

        // Profiles
        await Promise.allSettled(
          _.map(userAgents, (userAgent) => {
            if (rolesProfilesByRole[userAgent.role]?.profile) {
              return leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
                userAgent.id,
                {
                  permissionName: `plugins.users.profile.inside.${
                    rolesProfilesByRole[userAgent.role].profile
                  }`,
                  actionNames: ['view'],
                },
                { throwIfExists: false, transacting }
              );
            }
            return null;
          })
        );

        // Center - Profiles
        await Promise.allSettled(
          _.map(userAgents, (userAgent) => {
            if (
              rolesCentersByRole[userAgent.role]?.center &&
              rolesProfilesByRole[userAgent.role]?.profile
            ) {
              return leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
                userAgent.id,
                {
                  permissionName: `plugins.users.center-profile.inside.${
                    rolesCentersByRole[userAgent.role].center
                  }.${rolesProfilesByRole[userAgent.role].profile}`,
                  actionNames: ['view'],
                },
                { throwIfExists: false, transacting }
              );
            }
            return null;
          })
        );
      } catch (e) {
        console.error('addCenterProfilePermissionToUserAgents error', e);
        // Nothing
      }
    },
    table.users,
    _transacting
  );
}

module.exports = { addCenterProfilePermissionToUserAgents };
