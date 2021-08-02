const _ = require('lodash');
const constants = require('./config/constants');
const recoverEmail = require('./emails/recoverPassword');
const resetPassword = require('./emails/resetPassword');
const { addMain, addWelcome, addProfiles } = require('./src/services/menu-builder');

async function events() {
  const loadServices = {
    dataset: false,
    multilanguage: false,
  };

  const initDataset = async () => {
    await Promise.all(
      _.map(constants.defaultDatasetLocations, (config) =>
        leemons.getPlugin('dataset').services.dataset.addLocation(config)
      )
    );
    leemons.events.emit('init-dataset-locations');
  };

  // Dataset locations
  leemons.events.once('plugins.dataset:pluginDidLoadServices', async () => {
    if (loadServices.multilanguage) initDataset();
    loadServices.dataset = true;
  });
  leemons.events.once('plugins.multilanguage:pluginDidLoadServices', async () => {
    if (loadServices.dataset) initDataset();
    loadServices.multilanguage = true;
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
}

module.exports = events;
