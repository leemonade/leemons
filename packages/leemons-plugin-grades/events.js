async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
      // Do something
    });
  }
}

module.exports = events;
