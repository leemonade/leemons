// const constants = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      // TODO: Insert permissions
      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once('plugins.xapi:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
    });
  }
}

module.exports = events;
