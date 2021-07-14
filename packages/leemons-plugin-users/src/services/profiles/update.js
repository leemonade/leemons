const _ = require('lodash');
const { update: updateRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');

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
      table.userAuth.updateMany({ profile: data.id }, { reloadPermissions: true }, { transacting }),
    ]);

    // *** Only get one profile role for now
    const profileRole = await table.profileRole.findOne({ profile: profile.id });
    await updateRole(
      {
        id: profileRole.role,
        name: `role-for-profile-${profile.id}`,
        permissions: permissionsForRole,
      },
      { transacting }
    );

    return profile;
  });
}

module.exports = { update };
