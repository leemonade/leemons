const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const slugify = require('slugify');
const getProfileRole = require('./getProfileRole');
const { existName } = require('./existName');
const {
  markAllUsersWithProfileToReloadPermissions,
} = require('./permissions/markAllUsersWithProfileToReloadPermissions');
const { updateProfileTranslations } = require('./updateProfileTranslations');

async function update({ ctx, ...data }) {
  const exist = await existName({
    name: data.name,
    id: data.id,
    ctx,
  });
  if (exist)
    throw new LeemonsError(ctx, {
      message: `Already exists one profile with the name '${data.name}'`,
    });

  const [profile] = await Promise.all([
    ctx.tx.db.Profiles.findByIdAndUpdate(data.id, {
      name: data.name,
      description: data.description,
      uri: slugify(data.name, { lower: true }),
    }),
    markAllUsersWithProfileToReloadPermissions({ profileId: data.id, ctx }),
  ]);

  if (data.translations) {
    await updateProfileTranslations({ profile, translations: data.translations, ctx });
  }

  const profileRole = await getProfileRole({ profileId: profile.id, ctx });

  // Formato: data.permissions
  // [{ permissionName, actionNames }]
  await ctx.call('users.roles.update', {
    id: profileRole,
    name: `profile:${profile.id}:role`,
    type: ctx.prefixPN('profile-role'),
    permissions: data.permissions,
  });

  ctx.emit('profile-permissions-change', { profile, permissions: data.permissions });

  return profile;
}

module.exports = { update };
