const { find, isEmpty } = require('lodash');
const {
  permissions,
  menuItems,
  pluginName,
  categories,
  categoriesMenu,
} = require('./config/constants');
const { defaultCategory: defaultCategoryKey } = require('./config/config');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  if (!isInstalled) {
    // ·······························································
    // REGISTER PERMISSIONS

    leemons.events.once('plugins.users:init-permissions', async () => {
      const { services } = leemons.getPlugin('users');
      await services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    // ·······························································
    // REGISTER MENU ITEMS & CATEGORIES

    leemons.events.once(
      [
        'plugins.menu-builder:init-main-menu',
        `${pluginName}:pluginDidLoadServices`,
        `${pluginName}:init-permissions`,
      ],
      async () => {
        const { services } = leemons.getPlugin('menu-builder');
        const [mainItem] = menuItems;
        const { add: addCategory } = leemons.plugin.services.categories;
        const { setDefaultCategory } = leemons.plugin.services.settings;

        await Promise.all([
          // Adds item to Main menu
          services.menuItem.addItemsFromPlugin(mainItem),
          // Create categories Menu
          services.menu.add(categoriesMenu.key, categoriesMenu.permissions),
        ]);
        leemons.events.emit('init-menu');

        const initialCategories = await Promise.all(
          categories.map((category) => addCategory(category))
        );
        const defaultCategory = find(initialCategories, { key: defaultCategoryKey });
        if (!isEmpty(defaultCategory)) {
          await setDefaultCategory(defaultCategory.id);
        }
        leemons.events.emit('init-categories');
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
