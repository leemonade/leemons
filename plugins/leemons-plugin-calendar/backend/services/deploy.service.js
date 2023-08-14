/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const _ = require('lodash');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { addPermissionsDeploy } = require('leemons-permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('leemons-widgets');
const { LeemonsMultiEventsMixin } = require('leemons-multi-events');
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { getServiceModels } = require('../models');
const { permissions, widgets, menuItems, kanbanColumns } = require('../config/constants');

const onAcademicPortfolioRemoveClassStudents = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClassStudents');
const onAcademicPortfolioAddClassStudent = require('../core/pluginEvents/class/onAcademicPortfolioAddClassStudent');
const onAcademicPortfolioRemoveStudentFromClass = require('../core/pluginEvents/class/onAcademicPortfolioRemoveStudentFromClass');
const onAcademicPortfolioUpdateClass = require('../core/pluginEvents/class/onAcademicPortfolioUpdateClass');
const onAcademicPortfolioAddClass = require('../core/pluginEvents/class/onAcademicPortfolioAddClass');
const onAcademicPortfolioRemoveClasses = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClasses');
const onAcademicPortfolioAddClassTeacher = require('../core/pluginEvents/class/onAcademicPortfolioAddClassTeacher');
const onAcademicPortfolioRemoveClassTeachers = require('../core/pluginEvents/class/onAcademicPortfolioRemoveClassTeachers');

const {
  onAcademicPortfolioAddProgram,
} = require('../core/pluginEvents/program/onAcademicPortfolioAddProgram');
const {
  onAcademicPortfolioUpdateProgram,
} = require('../core/pluginEvents/program/onAcademicPortfolioUpdateProgram');
const {
  onAcademicPortfolioRemovePrograms,
} = require('../core/pluginEvents/program/onAcademicPortfolioRemovePrograms');

const addEventTypes = require('../core/event-types/add');

async function addEventType({ ctx }) {
  // TODO Migration: Hemos usado la llamada a deploy manager para ver si está instalado o no
  // ? Está eso bien? o es mejor "jugar" con la colección KeyValue ?
  const isInstalled = ctx.tx.call('deployment-manager.pluginIsInstalled', {
    pluginName: 'calendar',
  });
  if (!isInstalled) {
    // eslint-disable-next-line global-require
    const { add: addKanbanColumn } = require('../core/kanban-columns/add');

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
  }
  ctx.tx.emit('init-event-types');
}

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'calendar.deploy',
  version: 1,
  mixins: [
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [
    {
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
      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      // Event types
      await addEventType({ ctx });
    },
    'dashboard.init-widget-zones': async (ctx) => {
      // Widgets
      console.log('------------ZONAS--------------');
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
    },
    'calendar.init-widget-zones': async (ctx) => {
      console.log('------------ITEMS--------------');
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
    },

    'multilanguage.newLocale': async function newLocaleEvent(ctx) {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
    },

    // --- Classes ---
    'academic-portfolio:after-remove-classes-students': onAcademicPortfolioRemoveClassStudents,
    'academic-portfolio.after-add-class-student': onAcademicPortfolioAddClassStudent,
    'academic-portfolio.after-remove-students-from-class':
      onAcademicPortfolioRemoveStudentFromClass,
    'academic-portfolio.after-update-class': onAcademicPortfolioUpdateClass,
    'academic-portfolio.after-add-class': onAcademicPortfolioAddClass,
    'academic-portfolio.before-remove-classes': onAcademicPortfolioRemoveClasses,
    'academic-portfolio.after-add-class-teacher': onAcademicPortfolioAddClassTeacher,
    'academic-portfolio.after-remove-classes-teachers': onAcademicPortfolioRemoveClassTeachers,

    // --- Programs ---
    'academic-portfolio.after-add-program': onAcademicPortfolioAddProgram,
    'academic-portfolio.after-update-program': onAcademicPortfolioUpdateProgram,
    'academic-portfolio.after-remove-programs': onAcademicPortfolioRemovePrograms,
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
