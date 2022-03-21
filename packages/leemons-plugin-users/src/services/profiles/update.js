const _ = require('lodash');
const getProfileRole = require('./getProfileRole');
const { update: updateRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./permissions/markAllUsersWithProfileToReloadPermissions');
const { updateProfileTranslations } = require('./updateProfileTranslations');

async function update(data, { transacting: _transacting } = {}) {
  const exist = await existName(data.name, data.id);
  if (exist) throw new Error(`Already exists one profile with the name '${data.name}'`);

  return global.utils.withTransaction(
    async (transacting) => {
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

      if (data.translations)
        await updateProfileTranslations(profile, data.translations, { transacting });
      const profileRole = await getProfileRole(profile.id, { transacting });

      // Formato: data.permissions
      // [{ permissionName, actionNames }]
      await leemons.plugin.services.roles.update(
        {
          id: profileRole,
          name: `profile:${profile.id}:role`,
          type: leemons.plugin.prefixPN('profile-role'),
          permissions: data.permissions,
        },
        { transacting }
      );

      leemons.events.emit('profile-permissions-change', { profile, permissions: data.permissions });

      return profile;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { update };
