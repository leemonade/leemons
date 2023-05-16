const _ = require('lodash');
const constants = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once('plugins.package-manager:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
    });
  }
}

module.exports = events;
