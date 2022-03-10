const _ = require('lodash');
const constants = require('./config/constants');
const recoverEmail = require('./emails/recoverPassword');
const welcomeEmail = require('./emails/welcome');
const newProfileAdded = require('./emails/newProfileAdded');
const resetPassword = require('./emails/resetPassword');
const {
  addMain,
  addWelcome,
  addProfiles,
  addUserData,
  addUsers,
} = require('./src/services/menu-builder');
const init = require('./init');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
  });
  leemons.events.once('plugins.dataset:save-field', async (a, event) => {
    const {
      updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset,
      // eslint-disable-next-line global-require
    } = require('./src/services/user-agents/updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset');

    await updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset(event);
  });

  if (!isInstalled) {
    const initUsers = async () => {
      const actionsService = require('./src/services/actions');
      const permissionService = require('./src/services/permissions');
      await actionsService.init();
      leemons.events.emit('init-actions');
      await permissionService.init();
      leemons.events.emit('init-permissions');
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
    leemons.events.once(
      ['plugins.multilanguage:pluginDidLoad', 'plugins.dataset:pluginDidLoadServices'],
      async () => {
        await initDataset();
      }
    );

    leemons.events.once(
      ['plugins.users:pluginDidLoad', 'plugins.multilanguage:pluginDidLoad'],
      async () => {
        await initUsers();
      }
    );

    // Emails
    leemons.events.once('plugins.emails:pluginDidLoadServices', async () => {
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
      await leemons
        .getPlugin('emails')
        .services.email.addIfNotExist(
          'user-welcome',
          'es-ES',
          'Bienvenida',
          welcomeEmail.es,
          leemons.getPlugin('emails').services.email.types.active
        );
      await leemons
        .getPlugin('emails')
        .services.email.addIfNotExist(
          'user-welcome',
          'en',
          'Welcome',
          welcomeEmail.en,
          leemons.getPlugin('emails').services.email.types.active
        );
      await leemons
        .getPlugin('emails')
        .services.email.addIfNotExist(
          'user-new-profile-added',
          'es-ES',
          'Nuevo perfil',
          newProfileAdded.es,
          leemons.getPlugin('emails').services.email.types.active
        );
      await leemons
        .getPlugin('emails')
        .services.email.addIfNotExist(
          'user-new-profile-added',
          'en',
          'New profile',
          newProfileAdded.en,
          leemons.getPlugin('emails').services.email.types.active
        );
      leemons.events.emit('init-email-reset-password');
      leemons.events.emit('init-emails');
    });

    leemons.events.once('plugins.menu-builder:init-main-menu', async () => {
      try {
        await addMain();
        leemons.events.emit('init-menu');
        await Promise.all([addWelcome(), addProfiles(), addUserData(), addUsers()]);
        leemons.events.emit('init-submenu');
      } catch (e) {
        console.error('Error users menu', e);
      }
    });
  } else {
    leemons.events.once('plugins.users:pluginDidInit', async () => {
      leemons.events.emit('init-actions');
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-dataset-locations');
      leemons.events.emit('init-email-reset-password');
      leemons.events.emit('init-emails');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
