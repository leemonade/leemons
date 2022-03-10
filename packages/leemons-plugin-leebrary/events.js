const { permissions, menuItems, pluginName } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const init = require('./init');

async function initMenuBuilder() {
  const [mainItem] = menuItems;

  await addMenuItems(mainItem);
  leemons.events.emit('init-menu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
  });

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const { services } = leemons.getPlugin('users');
      await services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', `${pluginName}:init-permissions`],
      async () => {
        await initMenuBuilder();
      }
    );
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
    });
  }
}

module.exports = events;
