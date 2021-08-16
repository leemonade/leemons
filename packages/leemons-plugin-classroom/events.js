const _ = require('lodash');
const { defaultPermissions } = require('./config/constants');
const {
  addMain,
  addWelcome,
  addTree,
  addOrganization,
  addClasses,
} = require('./src/services/menu-builder');
const init = require('./init');

// TODO: el proceso de gestionar los elementos que se añaden al MenuBuilder debería estar abstraido
// tal y como se está haciendo ahora pero, en lugar de en cada Plugin, hacerlo a nivel del propio MenuBuilder
async function initMenuBuilder() {
  await addMain();
  leemons.events.emit('init-menu');
  await Promise.all([addWelcome(), addTree(), addOrganization(), addClasses()]);
  leemons.events.emit('init-submenu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    init();
  });

  if (!isInstalled) {
    const loaded = {
      menuBuilder: false,
      users: false,
    };

    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(defaultPermissions);
      loaded.users = true;
      if (loaded.menuBuilder) await initMenuBuilder();
    });

    leemons.events.once('plugins.menu-builder:init-main-menu', async () => {
      if (loaded.users) await initMenuBuilder();
      loaded.menuBuilder = true;
    });
  }
}

module.exports = events;
