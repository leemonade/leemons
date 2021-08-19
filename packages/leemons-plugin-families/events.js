const _ = require('lodash');
const constants = require('./config/constants');
const { addFamiliesData } = require('./src/services/menu-builder/addFamiliesData');

async function events(isInstalled) {
  if (!isInstalled) {
    // Menu
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.families:init-permissions'],
      async () => {
        await addFamiliesData();
        leemons.events.emit('init-menu');
      }
    );

    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });

    // Dataset
    leemons.events.once(
      ['plugins.dataset:pluginDidLoadServices', 'plugins.multilanguage:pluginDidLoad'],
      async () => {
        await Promise.all(
          _.map(constants.datasetLocations, (config) =>
            leemons.getPlugin('dataset').services.dataset.addLocation(config)
          )
        );
        leemons.events.emit('init-dataset-locations');
      }
    );
  }
}

module.exports = events;
