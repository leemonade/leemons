const _ = require('lodash');
const { permissions, menuItems, widgets } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once(
    ['plugins.menu-builder:init-main-menu', 'plugins.multilanguage:newLocale'],
    async () => {
      const [mainItem] = menuItems;
      await addMenuItems(mainItem);
    }
  );

  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.once('plugins.widgets:pluginDidLoad', async () => {
    await Promise.allSettled(
      _.map(widgets.zones, (config) =>
        leemons.getPlugin('widgets').services.widgets.setZone(config.key, {
          name: config.name,
          description: config.description,
        })
      )
    );
    leemons.events.emit('init-widget-zones');
    await Promise.allSettled(
      _.map(widgets.items, (config) =>
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

  leemons.events.once(
    [
      'plugins.users:init-permissions',
      'plugins.dataset:init-permissions',
      'plugins.calendar:init-permissions',
      'plugins.leebrary:init-permissions',
    ],
    async () => {
      const { services } = leemons.getPlugin('users');

      // Add permissions
      await services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    }
  );
}

//
module.exports = events;
