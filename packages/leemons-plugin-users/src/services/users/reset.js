const { encryptPassword } = require('./encryptPassword');
const { table } = require('../tables');
const constants = require('../../../config/constants');

/**
 * If there is a user with that email we check if there is already a recovery in progress, if
 * there is we resend the email with the previously generated code, if there is no recovery in
 * progress we update an existing expired one or create a new one.
 * @public
 * @static
 * @param {string} token - User token
 * @param {string} password - New user password
 * @param {any} ctx - Koa context
 * @return {Promise<undefined>} Updated user
 * */
async function reset(token, password, ctx) {
  const config = await this.getResetConfig(token);

  return table.users.transaction(async (transacting) => {
    const values = await Promise.all([
      table.users.update(
        { id: config.user.id },
        { password: await encryptPassword(password) },
        { transacting }
      ),
      table.userRecoverPassword.delete({ id: config.recoveryId }, { transacting }),
    ]);

    if (leemons.getPlugin('emails')) {
      await leemons
        .getPlugin('emails')
        .services.email.sendAsEducationalCenter(
          config.user.email,
          'user-reset-password',
          config.user.locale,
          {
            name: config.user.name,
            loginUrl: `${ctx.request.header.origin}/users/public/login`,
          }
        );
    }

    return values[0];
  });
}

module.exports = {
  reset,
};
