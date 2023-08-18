const { map } = require('lodash');
const { permissions, assignableRoles } = require('./config/constants');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once('plugins.assignables:init-plugin', async () => {
      const assignablesPlugin = leemons.getPlugin('assignables');
      await Promise.allSettled(
        map(assignableRoles, (role) =>
          assignablesPlugin.services.assignables.registerRole(role.role, role.options)
        )
      );
    });
  } else {
    leemons.events.once('plugins.scorm:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
