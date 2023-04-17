import _ from 'lodash';

async function getPermissionsWithActionsIfIHave(permissionNames) {
  const arr = _.isArray(permissionNames) ? permissionNames : [permissionNames];
  const data = await leemons.api('users/permission/get-if-have', {
    allAgents: true,
    method: 'POST',
    body: { permissionNames: arr },
  });

  if (!_.isArray(permissionNames)) {
    if (data.permissions.length) {
      [data.permissions] = data.permissions;
    } else {
      data.permissions = null;
    }
  }

  return data;
}

export default getPermissionsWithActionsIfIHave;
