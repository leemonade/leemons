const _ = require('lodash');
const { permissions, menuItems, assignableRoles } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

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
  leemons.events.once('multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.once(
    ['menu-builder:init-main-menu', 'academic-portfolio:init-permissions'],
    async () => {
      await initMenuBuilder();
    }
  );

  leemons.events.once('assignables:init-plugin', async () => {
    const assignablesPlugin = leemons.getPlugin('assignables');
    await Promise.allSettled(
      _.map(assignableRoles, (role) =>
        assignablesPlugin.services.assignables.registerRole(role.role, role.options)
      )
    );
  });

  if (!isInstalled) {
    leemons.events.once('users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once(
      [
        'leebrary:init-categories',
        `tests:init-permissions`,
        `providers.leebrary-tests:pluginDidSetEvents`,
      ],
      async () => {
        leemons.events.emit('init-provider');
      }
    );
  } else {
    leemons.events.once('tests:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
