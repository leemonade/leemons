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

module.exports = function events(isInstalled) {
  if (!isInstalled) {
    // Register permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      if (!usersPlugin) {
        throw new Error('Users plugin is not installed');
      }

      await usersPlugin.services.permissions.addMany(permissions.permissions);

      leemons.events.emit('init-permissions');
    });

    // Register menu items
    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', 'plugins.timetable:init-permissions'],
      async () => {
        await initMenuBuilder();
      }
    );
  }
};
