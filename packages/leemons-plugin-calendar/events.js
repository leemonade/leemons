const _ = require('lodash');
const constants = require('./config/constants');
const { add: addMenuItem } = require('./src/services/menu-builder/add');
const {
  onAcademicPortfolioAddClass,
  onAcademicPortfolioRemoveClasses,
  onAcademicPortfolioUpdateClass,
  onAcademicPortfolioAddClassStudent,
  onAcademicPortfolioRemoveClassStudents,
  onAcademicPortfolioRemoveStudentFromClass,
  onAcademicPortfolioAddClassTeacher,
} = require('./src/services/pluginEvents/class');

const {
  onAcademicPortfolioAddProgram,
  onAcademicPortfolioUpdateProgram,
  onAcademicPortfolioRemovePrograms,
} = require('./src/services/pluginEvents/program');
const {
  onAcademicPortfolioRemoveClassTeachers,
} = require('./src/services/pluginEvents/class/onAcademicPortfolioRemoveClassTeachers');
const { addLocales } = require('./src/services/locales/addLocales');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    await addLocales(['es', 'en']);
  });

  leemons.events.on('plugins.multilanguage:newLocale', async (event, locale) => {
    await addLocales(locale.code);
  });

  // --- Classes ---
  leemons.events.on(
    'plugins.academic-portfolio:after-remove-classes-students',
    onAcademicPortfolioRemoveClassStudents
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-add-class-student',
    onAcademicPortfolioAddClassStudent
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-remove-students-from-class',
    onAcademicPortfolioRemoveStudentFromClass
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-update-class',
    onAcademicPortfolioUpdateClass
  );
  leemons.events.on('plugins.academic-portfolio:after-add-class', onAcademicPortfolioAddClass);
  leemons.events.on(
    'plugins.academic-portfolio:before-remove-classes',
    onAcademicPortfolioRemoveClasses
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-add-class-teacher',
    onAcademicPortfolioAddClassTeacher
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-remove-classes-teachers',
    onAcademicPortfolioRemoveClassTeachers
  );

  // --- Programs ---
  leemons.events.on('plugins.academic-portfolio:after-add-program', onAcademicPortfolioAddProgram);
  leemons.events.on(
    'plugins.academic-portfolio:after-update-program',
    onAcademicPortfolioUpdateProgram
  );
  leemons.events.on(
    'plugins.academic-portfolio:after-remove-programs',
    onAcademicPortfolioRemovePrograms
  );

  if (!isInstalled) {
    // Menu
    leemons.events.once(
      [
        'plugins.users:init-menu',
        'plugins.calendar:init-permissions',
        'plugins.menu-builder:pluginDidLoad',
      ],
      async () => {
        for (let i = 0, l = constants.menuItems.length; i < l; i++) {
          // eslint-disable-next-line no-await-in-loop
          await addMenuItem(
            constants.menuItems[i].config,
            constants.menuItems[i].permissions,
            constants.menuItems[i].isCustomPermission
          );
        }
        leemons.events.emit('init-menu');
      }
    );

    // Event types
    leemons.events.once('plugins.calendar:pluginDidLoadServices', async () => {
      // eslint-disable-next-line global-require
      const { add: addKanbanColumn } = require('./src/services/kanban-columns/add');
      await Promise.all(_.map(constants.kanbanColumns, (d) => addKanbanColumn(d)));
      leemons.events.emit('init-kanban-columns');

      await leemons.plugin.services.calendar.addEventType(
        leemons.plugin.prefixPN('event'),
        'event',
        {
          config: {
            titleLabel: 'plugins.calendar.eventTitleLabel',
          },
        },
        {
          order: 1,
        }
      );
      await leemons.plugin.services.calendar.addEventType(
        leemons.plugin.prefixPN('task'),
        'task',
        {
          onlyOneDate: true,
          config: {
            titleLabel: 'plugins.calendar.taskTitleLabel',
            titlePlaceholder: 'plugins.calendar.taskPlaceholder',
            // fromLabel: 'plugins.calendar.fromLabelDeadline',
            hideAllDay: true,
            hideRepeat: true,
          },
        },
        {
          order: 2,
        }
      );
      leemons.events.emit('init-event-types');
    });

    // Permissions
    leemons.events.once('plugins.users:init-permissions', async () => {
      await leemons.getPlugin('users').services.permissions.addMany(constants.permissions);
      leemons.events.emit('init-permissions');
    });

    leemons.events.once('plugins.dashboard:init-widget-zones', async () => {
      await Promise.all(
        _.map(constants.widgets.zones, (config) =>
          leemons.getPlugin('widgets').services.widgets.setZone(config.key, {
            name: config.name,
            description: config.description,
          })
        )
      );
      leemons.events.emit('init-widget-zones');
      await Promise.all(
        _.map(constants.widgets.items, (config) =>
          leemons
            .getPlugin('widgets')
            .services.widgets.setItemToZone(config.zoneKey, config.key, config.url, {
              name: config.name,
              description: config.description,
              properties: config.properties,
            })
        )
      );
      leemons.events.emit('init-widget-items');
    });
  } else {
    leemons.events.once('plugins.calendar:pluginDidInit', async () => {
      leemons.events.emit('init-menu');
      leemons.events.emit('init-permissions');
      leemons.events.emit('init-event-types');
    });
  }
}

module.exports = events;
