const { encryptPassword } = require('./bcrypt/encryptPassword');
const { table } = require('../tables');

async function activateUser(userId, password) {
  return table.users.transaction(async (transacting) => {
    const user = await table.users.update(
      { id: userId },
      { password: await encryptPassword(password), status: 'password-registered', active: true },
      { transacting }
    );

    const userRegisterPasswordUser = await table.userRegisterPassword.findOne(
      { user: userId },
      { transacting }
    );

    if (userRegisterPasswordUser)
      await table.userRegisterPassword.delete({ user: userId }, { transacting });
    // if (leemons.getPlugin('emails')) {
    //   // TODO Mandar algun email si se quiere cuando el usuario haya seteado su contraseña del todo
    // }

    return user;
  });
}

module.exports = {
  activateUser,
};
