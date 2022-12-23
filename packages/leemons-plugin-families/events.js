const _ = require('lodash');
const constants = require('./config/constants');
const { add } = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    // Menu
    leemons.events.once(
      [
        'plugins.users:init-menu',
        'plugins.families:init-permissions',
        'plugins.menu-builder:pluginDidLoadServices',
      ],
      async () => {
        for (let i = 0, l = constants.menuItems.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
          await add(
            constants.menuItems[i].config,
            constants.menuItems[i].permissions,
            constants.menuItems[i].isCustomPermission
          );
        }
        leemons.events.emit('init-menu');
      }
    );

    leemons.events.once('plugins.users:init-widget-zones', async () => {
      await Promise.all(
        _.map(constants.widgets.items, (config) =>
          leemons
            .getPlugin('widgets')
            .services.widgets.addItemToZone(config.zoneKey, config.key, config.url, {
              name: config.name,
              description: config.description,
              properties: config.properties,
            })
        )
      );
      leemons.events.emit('init-widget-items');
    });

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
