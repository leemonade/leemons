module.exports = async (isInstalled) => {
  if (!isInstalled) {
    const loadServices = {
      users: false,
      menuBuilder: false,
    };

    const addMenu = async () => {
      console.log(leemons.plugin);
      await leemons.plugin.services.menu.add(leemons.plugin.config.constants.mainMenuKey);
      leemons.events.emit('init-main-menu');
    };
    leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
      if (loadServices.menuBuilder) addMenu();
      loadServices.users = true;
    });
    leemons.events.once('plugins.menu-builder:pluginDidLoadServices', async () => {
      if (loadServices.users) addMenu();
      loadServices.menuBuilder = true;
    });
  }
};
