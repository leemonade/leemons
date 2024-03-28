const { encryptPassword } = require('./bcrypt/encryptPassword');
const { sendActivationEmailsByProfileToUser } = require('./sendActivationEmailsByProfileToUser');
const { profiles: getUserProfiles } = require('./profiles');

async function activateUser({ userId, password, ctx }) {
  const user = await ctx.tx.db.Users.findOneAndUpdate(
    { id: userId },
    { password: await encryptPassword(password), status: 'password-registered', active: true },
    { new: true, lean: true }
  );

  const userRegisterPasswordUser = await ctx.tx.db.UserRegisterPassword.findOne({
    user: userId,
  }).lean();

  if (userRegisterPasswordUser) await ctx.tx.db.UserRegisterPassword.deleteOne({ user: userId });

  const profiles = await getUserProfiles({ user: userId, ctx });
  profiles.map((profile) => sendActivationEmailsByProfileToUser({ user, profile, ctx }));

  return user;
}

module.exports = {
  activateUser,
};
