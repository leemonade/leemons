const _ = require('lodash');
const { add: addRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');

async function add(data) {
  const exist = await existName(data.name);
  if (exist) throw new Error(`Already exists one profile with the name '${data.name}'`);
  const permissionsForRole = [];
  _.forIn(data.permissions, (actionNames, permissionName) => {
    permissionsForRole.push({ permissionName, actionNames });
  });
  return table.profiles.transaction(async (transacting) => {
    const profile = await table.profiles.create(
      {
        name: data.name,
        description: data.description,
        uri: global.utils.slugify(data.name, { lower: true }),
      },
      { transacting }
    );
    const role = await addRole(
      {
        name: `role-for-profile-${profile.id}`,
        permissions: permissionsForRole,
      },
      { transacting }
    );

    await table.profileRole.create(
      {
        profile: profile.id,
        role: role.id,
      },
      { transacting }
    );
    return profile;
  });
}

module.exports = { add };
