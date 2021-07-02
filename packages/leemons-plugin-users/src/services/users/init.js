const _ = require('lodash');
const constants = require('../../../config/constants');
const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');
const recoverEmail = require('../../../emails/recoverPassword');
const resetPassword = require('../../../emails/resetPassword');

async function initDatasetLocation(config) {
  try {
    await leemons.plugins.dataset.services.dataset.addLocation(config);
  } catch (err) {}
}

async function init() {
  await generateJWTPrivateKey();

  // Adding dataset locations
  if (leemons.plugins.dataset) {
    await Promise.all(
      _.map(constants.defaultDatasetLocations, (config) => initDatasetLocation(config))
    );
  }

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
