const _ = require('lodash');
const constants = require('./config/constants');
const { add: addMenuItem } = require('./src/services/menu-builder/add');
const { translations } = require('./src/translations');
const es = require('./src/i18n/es');
const en = require('./src/i18n/en');
const {
  onAcademicPortfolioAddClass,
  onAcademicPortfolioRemoveClasses,
  onAcademicPortfolioUpdateClass,
  onAcademicPortfolioAddClassStudent,
  onAcademicPortfolioRemoveClassStudents,
  onAcademicPortfolioRemoveStudentFromClass,
} = require('./src/services/pluginEvents/class');

const {
  onAcademicPortfolioAddProgram,
  onAcademicPortfolioUpdateProgram,
  onAcademicPortfolioRemovePrograms,
} = require('./src/services/pluginEvents/program');

async function events(isInstalled) {
  leemons.events.once('plugins.multilanguage:pluginDidLoad', async () => {
    if (translations()) {
      await translations().common.setManyByJSON(
        {
          es,
          en,
        },
        leemons.plugin.prefixPN('')
      );
    }
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
          await addMenuItem(
            constants.menuItems[i].config,
            constants.menuItems[i].permissions,
            constants.menuItems[i].isCustomPermission
          );
        }
        leemons.events.emit('init-menu');
        const { add: addKanbanColumn } = require('./src/services/kanban-columns/add');
        await Promise.all(_.map(constants.kanbanColumns, (d) => addKanbanColumn(d)));
        leemons.events.emit('init-kanban-columns');
      }
    );

    // Event types
    leemons.events.once('plugins.calendar:pluginDidLoadServices', async () => {
      await leemons.plugin.services.calendar.addEventType(
        leemons.plugin.prefixPN('event'),
        'event'
      );
      await leemons.plugin.services.calendar.addEventType(leemons.plugin.prefixPN('task'), 'task', {
        onlyOneDate: true,
      });
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
          leemons.getPlugin('widgets').services.widgets.addZone(config.key, {
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
            .services.widgets.addItemToZone(config.zoneKey, config.key, config.url, {
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
