const { LeemonsError } = require('@leemons/error');
const slugify = require('slugify');

const { getDefaultLocale } = require('../platform');

const createNecessaryRolesForProfilesAccordingToCenters = require('./createNecessaryRolesForProfilesAccordingToCenters');
const { existName } = require('./existName');
const { updateProfileTranslations } = require('./updateProfileTranslations');

/**
 * Adds a new profile to the system with necessary roles and permissions.
 * @param {Object} params - The parameters for creating a profile.
 * @param {string} params.name - The name of the profile.
 * @param {string} params.description - The description of the profile.
 * @param {Array} params.permissions - The permissions associated with the profile.
 * @param {Object} params.translations - Translations for the profile name and description.
 * @param {boolean} params.indexable - Indicates if the profile is indexable.
 * @param {string} params.sysName - System name for the profile.
 * @param {Object} params.ctx - The context object containing transaction and other necessary data.
 * @returns {Promise<Object>} The created profile object.
 * @throws {LeemonsError} If a profile with the same name already exists.
 */

async function add({ name, description, permissions, translations, indexable, sysName, ctx }) {
  const exist = await existName({ name, ctx });
  if (exist)
    throw new LeemonsError(ctx, { message: `Already exists one profile with the name '${name}'` });

  let profile = await ctx.tx.db.Profiles.create({
    name,
    description,
    uri: slugify(name, { lower: true }),
    indexable,
    sysName,
  });
  profile = profile.toObject();

  const role = await ctx.tx.call('users.roles.add', {
    name: `profile:${profile.id}:role`,
    type: ctx.prefixPN('profile-role'),
    permissions,
  });

  profile = await ctx.tx.db.Profiles.findByIdAndUpdate(
    profile.id,
    { role: role.id },
    { lean: true, new: true }
  );

  if (translations) await updateProfileTranslations({ profile, translations, ctx });

  const platformLocale = await getDefaultLocale({ ctx });

  // ES: Creamos el dataset para este perfil para poder añadir campos extras
  // EN: We create the dataset for this profile to be able to add extra fields
  await ctx.tx.call('dataset.dataset.addLocation', {
    name: {
      [platformLocale]: `profile:${profile.id}`,
    },
    locationName: `profile.${profile.id}`,
    pluginName: 'users',
  });

  await createNecessaryRolesForProfilesAccordingToCenters({ profileIds: profile.id, ctx });

  ctx.tx.emit('profile-permissions-change', { profile, permissions });

  return profile;
}

module.exports = { add };
