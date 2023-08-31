const { pluginName, menuItems, permissions } = require('./config/constants');
const addMenuItems = require('./src/config/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

function initMenuBuilder() {
  leemons.events.once(
    ['plugins.menu-builder:init-main-menu', `${pluginName}:init-permissions`],
    async () => {
      const [mainItem, ...items] = menuItems;

      await addMenuItems(mainItem);
      leemons.events.emit('init-menu');

      await addMenuItems(items);
      leemons.events.emit('init-submenu');
    }
  );
}

function initPermissions(isInstalled) {
  leemons.events.once('plugins.users:init-permissions', async () => {
    const usersPlugin = leemons.getPlugin('users');

    if (!isInstalled) {
      await usersPlugin.services.permissions.addMany(permissions);
    } else {
      for (let i = 0; i < permissions.length; i++) {
        const permission = permissions[i];
        try {
          // eslint-disable-next-line no-await-in-loop
          await usersPlugin.services.permissions.addMany([permission]);
        } catch (e) {
          if (e.message.includes('already exists')) {
            leemons.log.warn(`Permission already added ${permission.permissionName}`);
          } else {
            throw e;
          }
        }
      }
    }

    leemons.events.emit('init-permissions');
  });
}

function initLocalizations() {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });
}

module.exports = async function events(isInstalled) {
  initLocalizations();
  initPermissions(isInstalled);
  initMenuBuilder();
};
