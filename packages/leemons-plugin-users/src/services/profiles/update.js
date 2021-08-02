const _ = require('lodash');
const getProfileRole = require('./getProfileRole');
const { update: updateRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./markAllUsersWithProfileToReloadPermissions');

async function update(data) {
  const exist = await existName(data.name, data.id);
  if (exist) throw new Error(`Already exists one profile with the name '${data.name}'`);
  const permissionsForRole = [];
  _.forIn(data.permissions, (actionNames, permissionName) => {
    permissionsForRole.push({ permissionName, actionNames });
  });
  return table.profiles.transaction(async (transacting) => {
    const [profile] = await Promise.all([
      table.profiles.update(
        { id: data.id },
        {
          name: data.name,
          description: data.description,
          uri: global.utils.slugify(data.name, { lower: true }),
        },
        { transacting }
      ),
      markAllUsersWithProfileToReloadPermissions(data.id, { transacting }),
    ]);

    const profileRole = await getProfileRole(profile.id);
    await updateRole(
      {
        id: profileRole,
        name: `role-for-profile-${profile.id}`,
        permissions: permissionsForRole,
      },
      { transacting }
    );

    return profile;
  });
}

module.exports = { update };
