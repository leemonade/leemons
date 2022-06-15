const { permissions, menuItems, profileSettings } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');

async function initMenuBuilder() {
  const [mainItem, ...items] = menuItems;

  await addMenuItems(mainItem);
  leemons.events.emit('init-menu');
  await addMenuItems(items);
  leemons.events.emit('init-submenu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    // ES: En lugar de lanzar el init aquí, lo lanzamos con una llamada a un endpoint desde el frontend
    // EN: In place of launching the init here, we launch it with a call to an endpoint from the frontend
    // init();
  });

  if (!isInstalled) {
    leemons.events.once(
      [
        'plugins.users:init-permissions',
        'plugins.dataset:init-permissions',
        'plugins.calendar:init-permissions',
        'plugins.leebrary:init-permissions',
      ],
      async () => {
        // Moved to endpoints to be called from frontend
        /*
        const { services } = leemons.getPlugin('users');

        // Create profile
        const profile = await services.profiles.add(profileSettings);
        console.log('-- SUPER ADMIN PROFILE --');
        console.dir(profile, { depth: null });

        // Add permissions
        await services.permissions.addMany(permissions.permissions);
        leemons.events.emit('init-permissions');
        */
      }
    );

    leemons.events.once(
      ['plugins.menu-builder:init-main-menu', 'plugins.academic-portfolio:init-permissions'],
      async () => {
        // ES: En lugar de lanzar el initMenuBuilder aquí, lo lanzamos con una llamada a un endpoint desde el frontend
        // EN: In place of launching the initMenuBuilder here, we launch it with a call to an endpoint from the frontend
        // await initMenuBuilder();
      }
    );
  } else {
    leemons.events.once('plugins.admin:pluginDidInit', async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
    });
  }
}

module.exports = events;
