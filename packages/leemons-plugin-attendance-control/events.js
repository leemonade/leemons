const _ = require('lodash');
const { permissions, menuItems, assignableRoles } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');
const constants = require('./config/constants');
// TODO: el proceso de gestionar los elementos que se añaden al MenuBuilder debería estar abstraido
// tal y como se está haciendo ahora pero, en lugar de en cada Plugin, hacerlo a nivel del propio MenuBuilder
async function initMenuBuilder() {
  const [...items] = menuItems;
  await addMenuItems(items);
  leemons.events.emit('init-menu');
  leemons.events.emit('init-submenu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.once(
    ['plugins.widgets:pluginDidLoad', 'plugins.dashboard:init-widget-zones'],
    async () => {
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
    }
  );

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', 'plugins.scores:init-menu'],
      async () => {
        await initMenuBuilder();
      }
    );
  } else {
    leemons.events.once('plugins.tests:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
