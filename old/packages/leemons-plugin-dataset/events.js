const constants = require('./config/constants');
const { addLocales } = require('./src/services/locales/addLocales');

module.exports = async (isInstalled) => {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      leemons.getPlugin('users').services.permissions.addMany(constants.defaultPermissions);
      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once('plugins.dataset:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
    });
  }
};
