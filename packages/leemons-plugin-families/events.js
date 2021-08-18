const _ = require('lodash');
const constants = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.families:init-permissions'],
      async () => {
        console.log('FLIPAS SE HAN LANZADO LOS DOS EVENTOS');
      }
    );
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });
  }
}

module.exports = events;
