const _ = require('lodash');
const { table } = require('../tables');
const { update } = require('./update');

async function addAllPermissionsToAllProfiles() {
  const [profiles, permissionActions] = await Promise.all([
    table.profiles.find(),
    table.permissionAction.find(),
  ]);
  const permissionByName = _.groupBy(permissionActions, 'permissionName');
  const permissions = [];
  _.forIn(permissionByName, (value, key) => {
    permissions.push({ permissionName: key, actionNames: _.map(value, 'actionName') });
  });

  return Promise.all(
    _.map(profiles, (profile) =>
      update({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        permissions,
      })
    )
  );
}

module.exports = { addAllPermissionsToAllProfiles };
