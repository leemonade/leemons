const _ = require('lodash');
const { permissions } = require('./config/constants');
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

  leemons.events.once('plugins.widgets:pluginDidLoad', async () => {
    await Promise.allSettled(
      _.map(constants.widgets.zones, (config) =>
        leemons.getPlugin('widgets').services.widgets.setZone(config.key, {
          name: config.name,
          description: config.description,
        })
      )
    );
    leemons.events.emit('init-widget-zones');
    await Promise.allSettled(
      _.map(constants.widgets.items, (config) =>
        leemons
          .getPlugin('widgets')
          .services.widgets.setItemToZone(config.zoneKey, config.key, config.url, {
            name: config.name,
            description: config.description,
            properties: config.properties,
          })
      )
    );
    leemons.events.emit('init-widget-items');
  });

  if (!isInstalled) {
    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions);
      leemons.events.emit('init-permissions');
    });

    // Menu
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.dashboard:init-permissions'],
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
  } else {
    leemons.events.once('plugins.dashboard:pluginDidInit', async () => {});
  }
}

module.exports = events;
