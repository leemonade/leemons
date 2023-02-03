/* eslint-disable global-require */
const { addLocales } = require('./src/services/locales/addLocales');
const { menuItems, permissions } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');

async function initMenuBuilder() {
  const [mainItem, ...items] = menuItems;
  // await addMain();
  await addMenuItems(mainItem);
  leemons.events.emit('init-menu');
  await addMenuItems(items);
  leemons.events.emit('init-submenu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', 'plugins.comunica:init-permissions'],
      async () => {
        await initMenuBuilder();
      }
    );

    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });
  }
}

module.exports = events;
