const { pluginName, permissions, menuItems } = require('./config/constants');
const addMenuItems = require('./src/services/menu-builder/add');
const { addLocales } = require('./src/services/locales/addLocales');

// TODO: el proceso de gestionar los elementos que se añaden al MenuBuilder debería estar abstraido
// tal y como se está haciendo ahora pero, en lugar de en cada Plugin, hacerlo a nivel del propio MenuBuilder
async function initMenuBuilder() {
  const [mainItem, ...items] = menuItems;
  await addMenuItems(mainItem);
  leemons.events.emit('init-menu');
  await addMenuItems(items);
  leemons.events.emit('init-submenu');
}

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.once(
    ['plugins.menu-builder:init-main-menu', `${pluginName}:init-permissions`],
    async () => {
      await initMenuBuilder();
    }
  );

  if (!isInstalled) {
    leemons.events.once('plugins.users:init-permissions', async () => {
      const usersPlugin = leemons.getPlugin('users');
      await usersPlugin.services.permissions.addMany(permissions.permissions);
      leemons.events.emit('init-permissions');
    });

    // EN: Register the assignable role
    // ES: Registrar el rol de asignable
    leemons.events.once('plugins.assignables:init-plugin', async () => {
      // EN: Register the assignable role
      // ES: Registrar el rol asignable
      await leemons.getPlugin('assignables').services.assignables.registerRole('task', {
        teacherDetailUrl: '/',
        studentDetailUrl: '/private/tasks/student-detail/:id/:user',
        evaluationDetailUrl: '/private/tasks/correction/:id/:user',
        previewUrl: '/private/tasks/library/:id/view',
        creatable: true,
        createUrl: '/private/tasks/library/create',
        canUse: [], // Assignables le calza 'calledFrom ('plugins.tasks')' y 'plugins.assignables'
        pluralName: { en: 'tasks', es: 'tareas' },
        singularName: { en: 'task', es: 'tarea' },
        order: 2,
        menu: {
          item: {
            iconSvg: '/public/tasks/leebrary-menu-icon.svg',
            activeIconSvg: '/public/tasks/leebrary-menu-icon.svg',
            label: {
              en: 'Tasks',
              es: 'Tareas',
            },
          },
          permissions: [
            {
              permissionName: 'plugins.tasks.library',
              actionNames: ['view', 'admin'],
            },
          ],
        },

        componentOwner: 'plugins.tasks',
        listCardComponent: 'ListCard',
        detailComponent: 'Detail',
      });
    });
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

module.exports = events;
