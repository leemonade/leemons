const { LeemonsError } = require('leemons-error');
const { STATUS, profileSettings } = require('../../config/constants');
const findOne = require('./findOne');
const update = require('./update');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function registerAdmin({ email, password, locale, ctx, ...user }) {
  const currentSettings = await findOne({ ctx });
  if (currentSettings && currentSettings.status !== STATUS.LOCALIZED) {
    throw new LeemonsError(ctx, { message: 'Super Admin already registered' });
  }

  const profile = await ctx.tx.call('users.profiles.saveBySysName', profileSettings);

  await ctx.tx.call('users.users.add', {
    email,
    password,
    locale,
    name: `${user?.name || 'Super'} ${user?.surnames || 'admin'}`,
    birthdate: user?.birthdate || new Date(),
    gender: user?.gender || 'male',
    active: true,
    roles: [profile.role],
  });

  return update({
    ...(currentSettings || {}),
    status: STATUS.ADMIN_CREATED,
    ctx,
  });
}

module.exports = registerAdmin;
