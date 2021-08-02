const actionsService = require('./src/services/actions');
const permissionService = require('./src/services/permissions');
const userService = require('./src/services/users');
const { addMain, addWelcome, addProfiles } = require('./src/services/menu-builder');
const _ = require('lodash');
const constants = require('./config/constants');
const recoverEmail = require('./emails/recoverPassword');
const resetPassword = require('./emails/resetPassword');

async function install() {
  console.log('Install users');
  // Dataset locations
  leemons.events.once('plugins.dataset:pluginDidLoadServices', async () => {
    console.log('DATASET INIT');
    await Promise.all(
      _.map(constants.defaultDatasetLocations, (config) =>
        leemons.getPlugin('dataset').services.dataset.addLocation(config)
      )
    );
    leemons.events.emit('init-dataset-locations');
  });

  // Emails
  leemons.events.once('plugins.emails:pluginDidLoadServices', async () => {
    console.log('EMAILS INIT');
    await leemons
      .getPlugin('emails')
      .services.email.addIfNotExist(
        'user-recover-password',
        'es-ES',
        'Recuperar contraseña',
        recoverEmail.es,
        leemons.getPlugin('emails').services.email.types.active
      );
    await leemons
      .getPlugin('emails')
      .services.email.addIfNotExist(
        'user-recover-password',
        'en',
        'Recover password',
        recoverEmail.en,
        leemons.getPlugin('emails').services.email.types.active
      );
    leemons.events.emit('init-email-recover-password');
    await leemons
      .getPlugin('emails')
      .services.email.addIfNotExist(
        'user-reset-password',
        'es-ES',
        'Su contraseña fue restablecida',
        resetPassword.es,
        leemons.getPlugin('emails').services.email.types.active
      );
    await leemons
      .getPlugin('emails')
      .services.email.addIfNotExist(
        'user-reset-password',
        'en',
        'Your password was reset',
        resetPassword.en,
        leemons.getPlugin('emails').services.email.types.active
      );
    leemons.events.emit('init-email-reset-password');
    leemons.events.emit('init-emails');
  });

  leemons.events.once('plugins.menu-builder:init-main-menu', async () => {
    console.log('MENU INIT');
    await addMain();
    leemons.events.emit('init-menu');
    await Promise.all([addWelcome(), addProfiles()]);
    leemons.events.emit('init-submenu');
  });

  await actionsService.init();
  leemons.events.emit('init-actions');
  await permissionService.init();
  leemons.events.emit('init-permissions');
  await userService.init();
}

module.exports = install;
