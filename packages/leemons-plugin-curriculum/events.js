const _ = require('lodash');

const { permissions } = require('./config/constants');
const constants = require('./config/constants');
const { add } = require('./src/services/menu-builder/add');

async function events(isInstalled) {
  if (!isInstalled) {
    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions);
      leemons.events.emit('init-permissions');
    });

    // Menu
    leemons.events.once(
      ['plugins.users:init-menu', 'plugins.curriculum:init-permissions'],
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
  }

  leemons.events.on('plugins.users:profile-permissions-change', async (a, data) => {
    const {
      onProfilePermissionsChange,
      // eslint-disable-next-line global-require
    } = require('./src/services/configs/onProfilePermissionsChange');
    await onProfilePermissionsChange(data);
    leemons.events.emit('permissions-change');
  });
}

module.exports = events;
