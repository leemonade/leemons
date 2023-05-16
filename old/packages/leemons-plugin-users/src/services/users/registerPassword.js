const { encryptPassword } = require('./bcrypt/encryptPassword');
const { table } = require('../tables');
const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');

async function registerPassword(token, password, ctx) {
  const config = await getRegisterPasswordConfig(token);

  return table.users.transaction(async (transacting) => {
    const values = await Promise.all([
      table.users.update(
        { id: config.user.id },
        { password: await encryptPassword(password), status: 'password-registered', active: true },
        { transacting }
      ),
      table.userRegisterPassword.delete({ id: config.recoveryId }, { transacting }),
    ]);

    if (leemons.getPlugin('emails')) {
      // TODO Mandar algun email si se quiere cuando el usuario haya seteado su contraseña del todo
    }

    return values[0];
  });
}

module.exports = {
  registerPassword,
};
