const { pluginName, menuItems } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');

async function initMenuBuilder() {
  const [mainItem, ...items] = menuItems;
  await addMenuItems(mainItem);
  leemons.events.emit('init-menu');
  await addMenuItems(items);
  leemons.events.emit('init-submenu');
}

async function events() {
  leemons.events.once(
    ['plugins.assignables:pluginDidLoadServices', 'plugins.leebrary:init-menu'],
    async () => {
      leemons.events.emit('init-plugin');
    }
  );

  leemons.events.once(
    ['plugins.menu-builder:init-main-menu'], // , `${pluginName}:init-permissions`],
    async () => {
      await initMenuBuilder();
    }
  );
  // TODO cuando se cambie el profesor de la clase en academic -portfolio se lance un evento que pille assignable para quitarle el permiso al profesor sobre los eventos y darselo al nuevo profesor
}

module.exports = events;
