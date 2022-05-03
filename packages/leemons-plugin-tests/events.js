const _ = require('lodash');
const { permissions, menuItems, category, assignableRoles } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const init = require('./init');

// TODO: el proceso de gestionar los elementos que se añaden al MenuBuilder debería estar abstraido
// tal y como se está haciendo ahora pero, en lugar de en cada Plugin, hacerlo a nivel del propio MenuBuilder
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
    init();
  });

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', 'plugins.academic-portfolio:init-permissions'],
      async () => {
        await initMenuBuilder();
      }
    );

    leemons.events.once(
      ['plugins.assignables:pluginDidLoadServices', 'plugins.leebrary:pluginDidLoadServices'],
      async () => {
        const assignablesPlugin = leemons.getPlugin('assignables');
        await Promise.all(
          _.map(assignableRoles, (role) => {
            console.log(role);
            return assignablesPlugin.services.assignables.registerRole(role);
          })
        );
      }
    );

    leemons.events.once(
      [
        'plugins.leebrary:init-categories',
        `plugins.tests:init-permissions`,
        `providers.leebrary-tests:pluginDidSetEvents`,
      ],
      async () => {
        leemons.events.emit('init-provider');
      }
    );
  } else {
    leemons.events.once(
      ['plugins.assignables:pluginDidLoadServices', 'plugins.leebrary:pluginDidLoadServices'],
      async () => {
        const assignablesPlugin = leemons.getPlugin('assignables');
        const a = await Promise.all(
          _.map(assignableRoles, (role) =>
            assignablesPlugin.services.assignables.registerRole(role)
          )
        );
        console.log(a);
      }
    );
    leemons.events.once('plugins.tests:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
