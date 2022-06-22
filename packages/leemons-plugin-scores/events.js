const { pluginName, menuItems, permissions } = require('./config/constants');
const initMultilanguage = require('./src/config/multilanguage/init');
const addMenuItems = require('./src/config/menu-builder/add');

function initMenuBuilder(isInstalled) {
  if (!isInstalled) {
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
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

function initPermissions(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');

      await usersPlugin.services.permissions.addMany(permissions);

      leemons.events.emit('init-permissions');
    });
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-permissions');
    });
  }
}

function initLocalizations() {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    initMultilanguage();
  });
}

module.exports = async function events(isInstalled) {
  initLocalizations();
  initPermissions(isInstalled);
  initMenuBuilder(isInstalled);
};
