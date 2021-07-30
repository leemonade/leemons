module.exports = async () => {
  leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
    await leemons.plugin.services.menu.add(leemons.plugin.config.constants.mainMenuKey);
    leemons.events.emit('init-main-menu');
  });
};
