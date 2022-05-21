const { pluginName, menuItems, permissions } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');

async function initMenuBuilder(isInstalled) {
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

async function events(isInstalled) {
  leemons.events.once(
    [
      'plugins.assignables:pluginDidLoadServices',
      'plugins.leebrary:init-menu',
      `${pluginName}:init-permissions`,
      `${pluginName}:init-menu`,
    ],
    async () => {
      leemons.events.emit('init-plugin');
    }
  );

  initPermissions(isInstalled);
  initMenuBuilder(isInstalled);

  // TODO cuando se cambie el profesor de la clase en academic -portfolio se lance un evento que pille assignable para quitarle el permiso al profesor sobre los eventos y darselo al nuevo profesor
}

module.exports = events;
