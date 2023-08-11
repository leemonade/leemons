const _ = require('lodash');

async function getSessionEmergencyPhoneNumbersPermissions(userSession, { transacting } = {}) {
  const permissionsNames = {
    phoneNumbersInfo: 'plugins.families-emergency-numbers.families-emergency-numbers',
  };
  const permissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
      query: {
        permissionName_$in: [permissionsNames.phoneNumbersInfo],
      },
    });
  const response = {
    permissionsNames,
    phoneNumbersInfo: { view: false, update: false },
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

module.exports = { getSessionEmergencyPhoneNumbersPermissions };
