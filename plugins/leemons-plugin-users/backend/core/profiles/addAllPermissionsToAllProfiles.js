const _ = require('lodash');
const { update } = require('./update');

async function addAllPermissionsToAllProfiles({ ctx }) {
  const [profiles, permissionActions] = await Promise.all([
    ctx.tx.db.Profiles.find().lean(),
    ctx.tx.db.PermissionAction.find().lean(),
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
        ctx,
      })
    )
  );
}

module.exports = { addAllPermissionsToAllProfiles };
