const _ = require('lodash');
const constants = require('./config/constants');
const { add } = require('./src/services/menu-builder/add');

async function events(isInstalled) {
  if (!isInstalled) {
    // Menu
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.families:init-permissions'],
      async () => {
        for (let i = 0, l = constants.menuItems.length; i < l; i++) {
          await add(
            constants.menuItems[i].config,
            constants.menuItems[i].permissions,
            constants.menuItems[i].isCustomPermission
          );
        }
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
  } else {
    leemons.events.once('plugins.families:pluginDidInit', async () => {
      leemons.events.emit('init-menu');
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-dataset-locations');
    });
  }
}

module.exports = events;
