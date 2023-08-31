/* eslint-disable global-require */
const _ = require('lodash');
const constants = require('./config/constants');
const recoverEmail = require('./emails/recoverPassword');
const welcomeEmail = require('./emails/welcome');
const newProfileAdded = require('./emails/newProfileAdded');
const resetPassword = require('./emails/resetPassword');
const {
  addMain,
  addRoles,
  addProfiles,
  addUserData,
  addUsers,
} = require('./src/services/menu-builder');
const { addLocales } = require('./src/services/locales/addLocales');
const {
  createInitialProfiles,
} = require('./src/services/profiles/createInitialProfiles/createInitialProfiles');

async function initEmails() {
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-recover-password',
      'es',
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
      'es',
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
      'es',
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
      'es',
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
}

async function events(isInstalled) {
  leemons.events.once('plugins.users:pluginDidLoad', async () => {
    const {
      syncUserAgentCenterProfilePermissionsIfNeed,
    } = require('./src/services/user-agents/__update__/syncUserAgentCenterProfilePermissionsIfNeed');

    await syncUserAgentCenterProfilePermissionsIfNeed(isInstalled);
  });

  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });
  leemons.events.once('plugins.dataset:save-field', async (a, event) => {
    const {
      updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset,
      // eslint-disable-next-line global-require
    } = require('./src/services/user-agents/updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset');

    await updateAllUserAgentsToNeedCheckDatasetValuesIfSaveFieldEventChangeDataset(event);
  });

  leemons.events.once('plugins.users:change-platform-locale', async () => {
    createInitialProfiles();
  });

  // Emails
  leemons.events.once('plugins.emails:pluginDidLoadServices', async () => {
    await initEmails();
  });

  leemons.events.once('plugins.widgets:pluginDidLoad', async () => {
    await Promise.allSettled(
      _.map(constants.widgets.zones, (config) =>
        leemons.getPlugin('widgets').services.widgets.setZone(config.key, {
          name: config.name,
          description: config.description,
        })
      )
    );
    leemons.events.emit('init-widget-zones');
  });

  leemons.events.once(
    ['plugins.users:pluginDidLoad', 'plugins.multilanguage:pluginDidLoad'],
    async () => {
      const actionsService = require('./src/services/actions');
      const permissionService = require('./src/services/permissions');
      await actionsService.init();
      leemons.events.emit('init-actions');
      await permissionService.init();
      leemons.events.emit('init-permissions');
    }
  );

  leemons.events.once('plugins.menu-builder:init-main-menu', async () => {
    try {
      await addMain();
      leemons.events.emit('init-menu');
      await Promise.all([addRoles(), addProfiles(), addUserData(), addUsers()]);
      leemons.events.emit('init-submenu');
    } catch (e) {
      console.error('Error users menu', e);
    }
  });

  if (!isInstalled) {
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
  } else {
    leemons.events.once('plugins.users:pluginDidInit', async () => {
      leemons.events.emit('init-actions');
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-dataset-locations');
      leemons.events.emit('init-email-reset-password');
      leemons.events.emit('init-emails');
    });
  }
}

module.exports = events;
