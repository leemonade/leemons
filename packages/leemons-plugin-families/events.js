const _ = require('lodash');
const constants = require('./config/constants');
const { addFamiliesData } = require('./src/services/menu-builder/addFamiliesData');

async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.families:init-permissions'],
      async () => {
        await addFamiliesData();
        leemons.events.emit('init-menu');
      }
    );
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });
  }
}

module.exports = events;
