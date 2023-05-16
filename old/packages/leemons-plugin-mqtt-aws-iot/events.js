/* eslint-disable global-require */
const _ = require('lodash');
const { addLocales } = require('./src/services/locales/addLocales');
const { menuItems, permissions, widgets, removeMenuItems } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const _removeMenuItems = require('./src/services/menu-builder/remove');

async function initMenuBuilder() {
  await addMenuItems(menuItems);
  leemons.events.emit('init-menu');
  leemons.events.emit('init-submenu');
  await _removeMenuItems(removeMenuItems);
}

async function events() {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.once('plugins.admin:init-widget-zones', async () => {
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
    ['plugins.menu-builder:init-main-menu', 'plugins.mqtt-aws-iot:init-permissions'],
    async () => {
      await initMenuBuilder();
    }
  );

  leemons.events.once('plugins.users:init-permissions', async () => {
    const usersPlugin = leemons.getPlugin('users');
    await usersPlugin.services.permissions.addMany(permissions.permissions);
    leemons.events.emit('init-permissions');
    await usersPlugin.services.permissions.deleteMany(permissions.removePermissions);
  });
}

module.exports = events;
