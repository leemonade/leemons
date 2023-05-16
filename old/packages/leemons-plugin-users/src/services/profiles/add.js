const { existName } = require('./existName');
const { table } = require('../tables');
const createNecessaryRolesForProfilesAccordingToCenters = require('./createNecessaryRolesForProfilesAccordingToCenters');
const { getDefaultLocale } = require('../platform');
const { updateProfileTranslations } = require('./updateProfileTranslations');

/**
 * Update the provided role
 * @public
 * @static
 * @param {ProfileAdd} data - Profile data
 * @param {RolePermissionsAdd} _permissions - Array of permissions
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function add(
  { name, description, permissions, translations, indexable },
  { transacting: _transacting, sysName = null } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const exist = await existName(name, undefined, { transacting });
      if (exist) throw new Error(`Already exists one profile with the name '${name}'`);

      let profile = await table.profiles.create(
        {
          name,
          description,
          uri: global.utils.slugify(name, { lower: true }),
          indexable,
          sysName,
        },
        { transacting }
      );

      const role = await leemons.plugin.services.roles.add(
        {
          name: `profile:${profile.id}:role`,
          type: leemons.plugin.prefixPN('profile-role'),
          permissions,
        },
        { transacting }
      );

      profile = await table.profiles.update({ id: profile.id }, { role: role.id }, { transacting });

      if (translations) await updateProfileTranslations(profile, translations, { transacting });

      // ES: Creamos el dataset para este perfil para poder añadir campos extras
      // EN: We create the dataset for this profile to be able to add extra fields
      const platformLocale = await getDefaultLocale();
      await leemons.getPlugin('dataset').services.dataset.addLocation({
        name: {
          [platformLocale]: `profile:${profile.id}`,
        },
        locationName: `profile.${profile.id}`,
        pluginName: 'plugins.users',
      });

      await createNecessaryRolesForProfilesAccordingToCenters(profile.id, undefined, {
        transacting,
      });

      leemons.events.emit('profile-permissions-change', { profile, permissions });

      return profile;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { add };
