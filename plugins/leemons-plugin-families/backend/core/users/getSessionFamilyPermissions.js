const _ = require('lodash');

async function getSessionFamilyPermissions(userSession, { transacting } = {}) {
  const permissionsNames = {
    basicInfo: 'families.families-basic-info',
    customInfo: 'families.families-custom-info',
    guardiansInfo: 'families.families-guardians-info',
    studentsInfo: 'families.families-students-info',
  };
  const permissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
      query: {
        permissionName_$in: [
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
      if (info.actionNames.indexOf('view') >= 0) value.view = true;
      if (info.actionNames.indexOf('update') >= 0) value.update = true;
    }
  });
  return response;
}

module.exports = { getSessionFamilyPermissions };
