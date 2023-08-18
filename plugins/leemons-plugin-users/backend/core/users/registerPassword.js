const { encryptPassword } = require('./bcrypt/encryptPassword');
const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');

async function registerPassword({ token, password, ctx }) {
  const config = await getRegisterPasswordConfig({ token, ctx });

  const values = await Promise.all([
    ctx.tx.db.Users.findOneAndUpdate(
      { id: config.user.id },
      { password: await encryptPassword(password), status: 'password-registered', active: true },
      { new: true }
    ),
    ctx.tx.db.UserRegisterPassword.deleteOne({ id: config.recoveryId }),
  ]);

  // if (leemons.getPlugin('emails')) {
  //   // TODO Mandar algun email si se quiere cuando el usuario haya seteado su contraseña del todo
  // }

  return values[0];
}

module.exports = {
  registerPassword,
};
