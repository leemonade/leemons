const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');
const recoverEmail = require('../../../emails/recoverPassword');
const resetPassword = require('../../../emails/resetPassword');

async function init() {
  await generateJWTPrivateKey();

  if (leemons.plugins.emails) {
    await leemons.plugins.emails.services.email.addIfNotExist(
      'user-recover-password',
      'es-ES',
      'Recuperar contraseña',
      recoverEmail.es,
      leemons.plugins.emails.services.email.types.active
    );
    await leemons.plugins.emails.services.email.addIfNotExist(
      'user-recover-password',
      'en',
      'Recover password',
      recoverEmail.en,
      leemons.plugins.emails.services.email.types.active
    );
    await leemons.plugins.emails.services.email.addIfNotExist(
      'user-reset-password',
      'es-ES',
      'Su contraseña fue restablecida',
      resetPassword.es,
      leemons.plugins.emails.services.email.types.active
    );
    await leemons.plugins.emails.services.email.addIfNotExist(
      'user-reset-password',
      'en',
      'Your password was reset',
      resetPassword.en,
      leemons.plugins.emails.services.email.types.active
    );
  }
}

module.exports = { init };
