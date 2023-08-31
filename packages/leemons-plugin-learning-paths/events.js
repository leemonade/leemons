const {
  pluginName,
  permissions: { permissions, permissionNames },
  menuItems,
  widgets,
} = require('./config/constants');
const addMenuItems = require('./src/initialization/menu-builder/add');
const { addLocales } = require('./src/initialization/multiLanguage/addLocales');

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

function initMenuBuilder() {
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
}

function initMultilanguage() {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });
}

function setupAssignables(isInstalled) {
  // EN: Register the assignable role
  // ES: Registrar el rol de asignable
  if (isInstalled) {
    return;
  }

  leemons.events.once('plugins.assignables:init-plugin', async () => {
    const assignableServices = leemons.getPlugin('assignables').services.assignables;
    // EN: Register the assignable role
    // ES: Registrar el rol asignable
    await assignableServices.registerRole('learningpaths.module', {
      // Not used yet
      dashboardUrl: '/private/learning-paths/modules/dashboard/:id',
      teacherDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      studentDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      evaluationDetailUrl: '/private/learning-paths/modules/dashboard/:id',
      previewUrl: '/private/learning-paths/modules/:id/view',
      creatable: true,
      createUrl: '/private/learning-paths/modules/new',
      canUse: [], // Usable by the plugin owner and assignables plugin
      pluralName: { en: 'modules', es: 'módulos' },
      singularName: { en: 'module', es: 'módulo' },
      order: 6,
      menu: {
        item: {
          iconSvg: '/public/learning-paths/modules-leebrary-icon.svg',
          activeIconSvg: '/public/learning-paths/modules-leebrary-icon.svg',
          label: {
            en: 'Modules',
            es: 'Módulos',
          },
        },
        permissions: [
          {
            permissionName: permissionNames.modules,
            actionNames: ['view', 'admin'],
          },
        ],
      },

      componentOwner: 'plugins.learning-paths',
      listCardComponent: 'ListCard',
      detailComponent: 'Detail',
    });
  });
}

function initWidgets(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.dashboard:init-widget-zones', async () => {
      const widgetsPlugin = leemons.getPlugin('widgets').services.widgets;
      const { items } = widgets;

      // EN: Register items
      // ES: Registra los items
      await Promise.all(
        items.map((item) =>
          widgetsPlugin.addItemToZone(item.zoneKey, item.key, item.url, {
            name: item.name,
            description: item.description,
            properties: item.properties,
          })
        )
      );

      leemons.events.emit('init-widget-items');
    });
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-widget-items');
    });
  }
}

async function events(isInstalled) {
  initPermissions(isInstalled);
  initMenuBuilder();
  initMultilanguage();
  setupAssignables(isInstalled);
  initWidgets(isInstalled);
}

module.exports = events;
