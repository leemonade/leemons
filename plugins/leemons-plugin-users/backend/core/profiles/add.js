const { LeemonsError } = require('leemons-error');
const slugify = require('slugify');
const { existName } = require('./existName');
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

  const role = await ctx.tx.call('users.roles.add', {
    name: `profile:${profile.id}:role`,
    type: ctx.prefixPN('profile-role'),
    permissions,
  });

  profile = await ctx.tx.db.Profiles.findByIdAndUpdate(
    profile.id,
    { role: role.id },
    { new: true }
  );

  if (translations) await updateProfileTranslations({ profile, translations, ctx });

  // ES: Creamos el dataset para este perfil para poder añadir campos extras
  // EN: We create the dataset for this profile to be able to add extra fields
  const platformLocale = await getDefaultLocale({ ctx });

  await ctx.tx.call('dataset.dataset.addLocation', {
    name: {
      [platformLocale]: `profile:${profile.id}`,
    },
    locationName: `profile.${profile.id}`,
    pluginName: 'plugins.users',
  });

  await createNecessaryRolesForProfilesAccordingToCenters({ profileIds: profile.id, ctx });

  ctx.emit('profile-permissions-change', { profile, permissions });

  return profile;
}

module.exports = { add };
