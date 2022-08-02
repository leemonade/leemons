const newActivity = require('./emails/userCreateAssignation');
const { addLocales } = require('./src/services/locales/addLocales');
const addMenuItems = require('./src/services/menu-builder/add');
const { pluginName, menuItems, permissions, widgets } = require('./config/constants');
const { afterRemoveClassesTeachers } = require('./src/services/events/afterRemoveClassesTeachers');
const { afterAddClassTeacher } = require('./src/services/events/afterAddClassTeacher');

async function initEmails() {
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-create-assignation',
      'es',
      'Nueva actividad',
      newActivity.es,
      leemons.getPlugin('emails').services.email.types.active
    );
  await leemons
    .getPlugin('emails')
    .services.email.addIfNotExist(
      'user-create-assignation',
      'en',
      'New activity',
      newActivity.en,
      leemons.getPlugin('emails').services.email.types.active
    );
  leemons.events.emit('init-email-recover-password');
  leemons.events.emit('init-emails');
}

function initMenuBuilder(isInstalled) {
  if (!isInstalled) {
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
  } else {
    leemons.events.once(`${pluginName}:pluginDidInit`, async () => {
      leemons.events.emit('init-menu');
      leemons.events.emit('init-submenu');
    });
  }
}

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

function initWidgets(isInstalled) {
  if (!isInstalled) {
    leemons.events.once('plugins.dashboard:init-widget-zones', async () => {
      const widgetsPlugin = leemons.getPlugin('widgets').services.widgets;
      const { zones, items } = widgets;

      // EN: Register zones
      // ES: Registra las zonas
      await Promise.all(
        zones.map((zone) =>
          widgetsPlugin.addZone(zone.key, {
            name: zone.name,
            description: zone.description,
          })
        )
      );

      leemons.events.emit('init-widget-zones');

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
  }
}

async function events(isInstalled) {
  const schedule = global.utils.cron.schedule('* * * * * *', () => {
    console.log('running a task every second');
  });

  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  leemons.events.on('plugins.academic-portfolio:after-add-class-teacher', async (event, data) => {
    await afterAddClassTeacher(data);
  });

  leemons.events.on(
    'plugins.academic-portfolio:after-remove-classes-teachers',
    async (event, data) => {
      await afterRemoveClassesTeachers(data);
    }
  );

  // Emails
  leemons.events.once('plugins.emails:pluginDidLoadServices', async () => {
    await initEmails();
  });

  leemons.events.once(
    [
      'plugins.assignables:pluginDidLoadServices',
      'plugins.leebrary:init-menu',
      `${pluginName}:init-permissions`,
      `${pluginName}:init-menu`,
      `${pluginName}:init-submenu`,
      `${pluginName}:init-widget-zones`,
      `${pluginName}:init-widget-items`,
    ],
    async () => {
      leemons.events.emit('init-plugin');
    }
  );

  initPermissions(isInstalled);
  initMenuBuilder(isInstalled);
  initWidgets(isInstalled);

  // TODO cuando se cambie el profesor de la clase en academic -portfolio se lance un evento que pille assignable para quitarle el permiso al profesor sobre los eventos y darselo al nuevo profesor
}

module.exports = events;
