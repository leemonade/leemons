/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const _ = require('lodash');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('@leemons/widgets');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');

const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { permissions, widgets, menuItems, kanbanColumns } = require('../config/constants');
const { add: addKanbanColumn } = require('../core/kanban-columns/add');
const {
  onAcademicPortfolioRemoveClassStudents,
} = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClassStudents');
const {
  onAcademicPortfolioAddClassStudent,
} = require('../core/pluginEvents/class/onAcademicPortfolioAddClassStudent');
const {
  onAcademicPortfolioRemoveStudentFromClass,
} = require('../core/pluginEvents/class/onAcademicPortfolioRemoveStudentFromClass');
const {
  onAcademicPortfolioUpdateClass,
} = require('../core/pluginEvents/class/onAcademicPortfolioUpdateClass');
const {
  onAcademicPortfolioAddClass,
} = require('../core/pluginEvents/class/onAcademicPortfolioAddClass');
const {
  onAcademicPortfolioRemoveClasses,
} = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClasses');
const {
  onAcademicPortfolioAddClassTeacher,
} = require('../core/pluginEvents/class/onAcademicPortfolioAddClassTeacher');
const {
  onAcademicPortfolioRemoveClassTeachers,
} = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClassTeachers');

const {
  onAcademicPortfolioAddProgram,
} = require('../core/pluginEvents/program/onAcademicPortfolioAddProgram');
const {
  onAcademicPortfolioUpdateProgram,
} = require('../core/pluginEvents/program/onAcademicPortfolioUpdateProgram');
const {
  onAcademicPortfolioRemovePrograms,
} = require('../core/pluginEvents/program/onAcademicPortfolioRemovePrograms');

const { add: addEventTypes } = require('../core/event-types/add');

async function addEventType({ ctx }) {
  if (!(await hasKey(ctx.tx.db.KeyValue, 'kanban-columns'))) {
    await Promise.all(_.map(kanbanColumns, (d) => addKanbanColumn({ data: d, ctx })));
    ctx.tx.emit('init-kanban-columns');

    await addEventTypes({
      key: ctx.prefixPN('event'),
      url: 'event',
      options: {
        config: {
          titleLabel: 'calendar.eventTitleLabel',
        },
      },
      order: 1,
      ctx,
    });
    await addEventTypes({
      key: ctx.prefixPN('task'),
      url: 'task',
      options: {
        onlyOneDate: true,
        config: {
          titleLabel: 'calendar.taskTitleLabel',
          titlePlaceholder: 'calendar.taskPlaceholder',
          // fromLabel: 'calendar.fromLabelDeadline',
          hideAllDay: true,
          hideRepeat: true,
        },
      },
      order: 2,
      ctx,
    });
    await setKey(ctx.tx.db.KeyValue, 'kanban-columns');
  }
  ctx.tx.emit('init-event-types');
}

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'calendar.deploy',
  version: 1,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['es', 'en'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [
    {
      type: 'once-per-install',
      events: ['users.init-menu', 'calendar.init-permissions'],
      handler: async (ctx) => {
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: menuItems,
          shouldWait: true,
          ctx,
        });
        ctx.tx.emit('init-menu');
      },
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
      // Event types
      await addEventType({ ctx });
    },
    'dashboard.init-widget-zones': async (ctx) => {
      // Widgets
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
    },

    // --- Classes ---
    'academic-portfolio.after-remove-classes-students': async (ctx) => {
      await onAcademicPortfolioRemoveClassStudents({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-add-class-student': async (ctx) => {
      await onAcademicPortfolioAddClassStudent({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-remove-students-from-class': async (ctx) => {
      await onAcademicPortfolioRemoveStudentFromClass({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-update-class': async (ctx) => {
      await onAcademicPortfolioUpdateClass({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-add-class': async (ctx) => {
      await onAcademicPortfolioAddClass({ ...ctx.params, ctx });
    },
    'academic-portfolio.before-remove-classes': async (ctx) => {
      await onAcademicPortfolioRemoveClasses({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-add-class-teacher': async (ctx) => {
      await onAcademicPortfolioAddClassTeacher({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-remove-classes-teachers': async (ctx) => {
      await onAcademicPortfolioRemoveClassTeachers({ ...ctx.params, ctx });
    },

    // --- Programs ---
    'academic-portfolio.after-add-program': async (ctx) => {
      await onAcademicPortfolioAddProgram({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-update-program': async (ctx) => {
      await onAcademicPortfolioUpdateProgram({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-remove-programs': async (ctx) => {
      await onAcademicPortfolioRemovePrograms({ ...ctx.params, ctx });
    },
  },
});
