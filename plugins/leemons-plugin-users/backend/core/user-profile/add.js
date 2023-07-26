const { LeemonsError } = require('leemons-error');
const { exist } = require('./exist');

/**
 * Add new user profile
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} _transacting - DB transaction
 * @return {Promise<boolean>}
 * */
async function add({ user, profile, ctx }) {
  if (await exist({ user, profile, ctx }))
    throw new LeemonsError(ctx, { message: 'The user profile already exists' });

  const userProfile = await ctx.tx.db.UserProfile.create({
    user,
    profile,
  });

  const role = await ctx.tx.call('users.roles.add', {
    name: `user-profile:${userProfile.id}:role`,
    type: ctx.prefixPN('user-profile-role'),
    permissions: [],
  });

  return ctx.tx.db.UserProfile.findOneAndUpdate(
    { id: userProfile.id },
    { role: role.id },
    { new: true }
  );
}

module.exports = { add };
