const _ = require('lodash');

async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.users:pluginDidLoadServices', async () => {
      console.log('Install the plugin');
    });
  }
}

module.exports = events;
