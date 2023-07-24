const _ = require('lodash');
const { getRolesCenters } = require('../roles/getRolesCenters');
const { getRolesProfiles } = require('../roles/getRolesProfiles');

async function addCenterProfilePermissionToUserAgents({ userAgentIds, ctx }) {
  try {
    const userAgents = await ctx.tx.db.UserAgent.find({
      id: _.isArray(userAgentIds) ? userAgentIds : [userAgentIds],
    });

    const roleIds = _.map(userAgents, 'role');
    const rolesCenters = await getRolesCenters({ roleIds, raw: true, ctx });
    const rolesProfiles = await getRolesProfiles({ roleIds, raw: true, ctx });
    const rolesCentersByRole = _.keyBy(rolesCenters, 'role');
    const rolesProfilesByRole = _.keyBy(rolesProfiles, 'role');

    // Centers
    await Promise.allSettled(
      _.map(userAgents, (userAgent) => {
        if (rolesCentersByRole[userAgent.role]?.center) {
          return ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
            userAgentId: userAgent.id,
            data: {
              permissionName: `plugins.users.center.inside.${
                rolesCentersByRole[userAgent.role].center
              }`,
              actionNames: ['view'],
            },
            throwIfExists: false,
          });
        }
        return null;
      })
    );

    // Profiles
    await Promise.allSettled(
      _.map(userAgents, (userAgent) => {
        if (rolesProfilesByRole[userAgent.role]?.profile) {
          return ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
            userAgentId: userAgent.id,
            data: {
              permissionName: `plugins.users.profile.inside.${
                rolesProfilesByRole[userAgent.role].profile
              }`,
              actionNames: ['view'],
            },
            throwIfExists: false,
          });
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
          return ctx.tx.call('users.permissions.addCustomPermissionToUserAgent', {
            userAgentId: userAgent.id,
            data: {
              permissionName: `plugins.users.center-profile.inside.${
                rolesCentersByRole[userAgent.role].center
              }.${rolesProfilesByRole[userAgent.role].profile}`,
              actionNames: ['view'],
            },
            throwIfExists: false,
          });
        }
        return null;
      })
    );
  } catch (e) {
    console.error('addCenterProfilePermissionToUserAgents error', e);
    // Nothing
  }
}

module.exports = { addCenterProfilePermissionToUserAgents };
