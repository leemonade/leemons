const _ = require('lodash');
const constants = require('./config/constants');
const { add } = require('./src/services/menu-builder/add');

async function events(isInstalled) {
  if (!isInstalled) {
    // Menu
    leemons.events.once(
      [
        'plugins.users:init-menu',
        'plugins.calendar:init-permissions',
        'plugins.menu-builder:pluginDidLoad',
      ],
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

    // Event types
    leemons.events.once('plugins.calendar:pluginDidLoadServices', async () => {
      await leemons.plugin.services.calendar.addEventType(
        leemons.plugin.prefixPN('event'),
        'calendar/components/event'
      );
      await leemons.plugin.services.calendar.addEventType(
        leemons.plugin.prefixPN('task'),
        'calendar/components/task'
      );
      leemons.events.emit('init-event-types');
    });

    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once('plugins.calendar:pluginDidInit', async () => {
      leemons.events.emit('init-menu');
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-event-types');
    });
  }
}

module.exports = events;
