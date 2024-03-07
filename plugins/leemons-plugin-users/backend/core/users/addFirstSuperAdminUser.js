const { LeemonsError } = require('@leemons/error');
const { encryptPassword } = require('./bcrypt/encryptPassword');

/**
 * Create the first super-administrator user only if no user exists in the database.
 * @public
 * @static
 * @param {string} name - User name
 * @param {string} surnames - User surnames
 * @param {string} email - User email
 * @param {string} password - User password in raw
 * @param {string} locale - User language
 * @return {Promise<User>} Created / Updated role
 * */
async function addFirstSuperAdminUser({ name, surnames, email, password, locale, ctx }) {
  const hasUsers = await ctx.tx.db.Users.countDocuments();
  if (!hasUsers) {
    const userDoc = await ctx.tx.db.Users.create({
      name,
      surnames,
      email,
      password: await encryptPassword(password),
      locale,
      active: true,
    });
    const user = userDoc.toObject();
    await ctx.tx.db.SuperAdminUser.create({ user: user.id });
    delete user.password;
    return user;
  }
  throw new LeemonsError(ctx, {
    message:
      'The first super administrator user can only be created if there are no users in the database.',
  });
}

module.exports = { addFirstSuperAdminUser };
