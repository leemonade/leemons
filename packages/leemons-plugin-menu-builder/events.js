const { addLocales } = require('./src/services/locales/addLocales');

module.exports = async (isInstalled) => {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    const addMenu = async () => {
      await leemons.plugin.services.menu.add(leemons.plugin.config.constants.mainMenuKey);
      leemons.events.emit('init-main-menu');
    };
    leemons.events.once(
      ['plugins.menu-builder:pluginDidLoadServices', 'plugins.users:init-permissions'],
      async () => {
        await addMenu();
      }
    );
  } else {
    leemons.events.once(
      ['plugins.menu-builder:pluginDidInit', 'plugins.menu-builder:pluginDidLoad'],
      async () => {
        leemons.events.emit('init-main-menu');
      }
    );
  }
};
