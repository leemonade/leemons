const fetch = require('node-fetch');
const { last } = require('lodash');
const { LeemonsError } = require('@leemons/error');
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

  const user = await ctx.tx.db.Users.findOne({ id: config.user.id }).lean();

  let setPassword = true;
  // Si esta external identity url, le mandamos que cambie la contraseña del usuario (email), si el
  // usuario no existe no dara un error y procedemos a añadir la contraseña en nuestra base de datos
  // como siempre si no da error no seteamos la contraseña en nuestra base de datos
  if (process.env.EXTERNAL_IDENTITY_URL) {
    try {
      // Is no error its done
      const r = await fetch(`${process.env.EXTERNAL_IDENTITY_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password,
          deploymentID: ctx.meta.deploymentID,
          manualPassword: process.env.MANUAL_PASSWORD,
        }),
      });

      const response = await r.json();

      if (!r.ok) {
        throw new LeemonsError(ctx, {
          message: response.message,
          httpStatusCode: r.status,
        });
      }

      setPassword = false;
    } catch (error) {
      console.error(error);
    }
  }

  let toUpdate = {};

  if (setPassword) {
    toUpdate = { password: await encryptPassword(password) };
  }

  const values = await Promise.all([
    ctx.tx.db.Users.findOneAndUpdate({ id: config.user.id }, toUpdate, { new: true, lean: true }),
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
