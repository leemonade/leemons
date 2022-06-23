const { permissions, menuItems } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once(
    ['plugins.menu-builder:init-main-menu', 'plugins.multilanguage:newLocale'],
    async () => {
      const [mainItem] = menuItems;
      await addMenuItems(mainItem);
    }
  );

  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
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
        const { services } = leemons.getPlugin('users');

        // Add permissions
        await services.permissions.addMany(permissions.permissions);
        leemons.events.emit('init-permissions');
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
