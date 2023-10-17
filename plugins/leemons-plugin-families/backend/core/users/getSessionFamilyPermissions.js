const _ = require('lodash');

async function getSessionFamilyPermissions({ ctx }) {
  const permissionsNames = {
    basicInfo: 'families.families-basic-info',
    customInfo: 'families.families-custom-info',
    guardiansInfo: 'families.families-guardians-info',
    studentsInfo: 'families.families-students-info',
  };

  const permissions = await ctx.tx.call('users.permissions.getUserAgentPermissions', {
    userAgent: ctx.meta.userSession.userAgents,
    query: {
      permissionName: [
        permissionsNames.basicInfo,
        permissionsNames.customInfo,
        permissionsNames.guardiansInfo,
        permissionsNames.studentsInfo,
      ],
    },
  });

  const response = {
    permissionsNames,
    basicInfo: { view: false, update: false },
    customInfo: { view: false, update: false },
    guardiansInfo: { view: false, update: false },
    studentsInfo: { view: false, update: false },
  };
  const permissionsByName = _.keyBy(permissions, 'permissionName');
  _.forIn(response, (value, key) => {
    const info = permissionsByName[permissionsNames[key]];
    if (info) {
      // eslint-disable-next-line no-param-reassign
      if (info.actionNames.indexOf('view') >= 0) value.view = true;
      // eslint-disable-next-line no-param-reassign
      if (info.actionNames.indexOf('update') >= 0) value.update = true;
    }
  });
  return response;
}

module.exports = { getSessionFamilyPermissions };
