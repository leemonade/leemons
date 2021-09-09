const init = require('./init');
module.exports = async (isInstalled) => {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
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
    leemons.events.once('plugins.menu-builder:pluginDidInit', async () => {
      leemons.events.emit('init-main-menu');
    });
  }
};
