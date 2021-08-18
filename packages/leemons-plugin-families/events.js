const _ = require('lodash');
const constants = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.users:init-menu', async () => {
      console.log('Install the plugin');
    });
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
    });
  }
}

module.exports = events;
