const { encryptPassword } = require('./bcrypt/encryptPassword');
const { getResetConfig } = require('./getResetConfig');
const getHostname = require('../platform/getHostname');

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
async function reset({ token, password, ctx }) {
  const config = await getResetConfig({ token, ctx });

  const values = await Promise.all([
    ctx.tx.db.Users.findOneAndUpdate(
      { id: config.user.id },
      { password: await encryptPassword(password) },
      { new: true, lean: true }
    ),
    ctx.tx.db.UserRecoverPassword.deleteOne({ id: config.recoveryId }),
  ]);

  if (
    await ctx.tx.call('deployment-manager.pluginIsInstalled', {
      pluginName: 'emails',
    })
  ) {
    const hostname = await getHostname({ ctx });
    await ctx.tx.call('emails.email.sendAsEducationalCenter', {
      to: config.user.email,
      templateName: 'user-reset-password',
      language: config.user.locale,
      context: {
        name: config.user.name,
        loginUrl: `${hostname}/users/public/login`,
      },
    });
  }

  return values[0];
}

module.exports = {
  reset,
};
