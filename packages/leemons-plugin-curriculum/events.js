const _ = require('lodash');

const { permissions } = require('./config/constants');

async function events(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions);
      leemons.events.emit('init-permissions');
    });
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
