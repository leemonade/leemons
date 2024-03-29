const { encryptPassword } = require('./bcrypt/encryptPassword');

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
  // if (leemons.getPlugin('emails')) {
  //   // TODO Mandar algun email si se quiere cuando el usuario haya seteado su contraseña del todo
  // }

  return user;
}

module.exports = {
  activateUser,
};
