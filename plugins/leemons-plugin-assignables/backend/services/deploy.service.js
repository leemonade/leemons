const path = require('path');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { LeemonsMultiEventsMixin } = require('leemons-multi-events');
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('leemons-widgets');
const { addPermissionsDeploy } = require('leemons-permissions');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
const { getEmailTypes } = require('leemons-emails');

const newActivity = require('../emails/userCreateAssignation');
const rememberActivity = require('../emails/userAssignationRemember');
const rememberActivityTimeout = require('../emails/userRememberAssignationTimeout');
const userWeekly = require('../emails/userWeekly');
const { menuItems, widgets, permissions } = require('../config/constants');
const { getServiceModels } = require('../models');
const { afterAddClassTeacher } = require('../core/events/afterAddClassTeacher');
const { afterRemoveClassesTeachers } = require('../core/events/afterRemoveClassesTeachers');

async function initEmails(ctx) {
  const emailsServiceAddIfNotExists = 'emails.email.addIfNotExist';

  await ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-create-assignation',
    language: 'es',
    subject: 'Nueva actividad',
    html: newActivity.es,
    type: getEmailTypes().active,
  });
  await ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-create-assignation',
    language: 'en',
    subject: 'New activity',
    html: newActivity.en,
    type: getEmailTypes().active,
  });
  ctx.tx.emit('init-email-recover-password');

  await ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-assignation-remember',
    language: 'es',
    subject: 'Recordatorio de actividad',
    html: rememberActivity.es,
    type: getEmailTypes().active,
  });
  ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-assignation-remember',
    language: 'en',
    subject: 'Activity reminder',
    html: rememberActivity.en,
    type: getEmailTypes().active,
  });

  ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-remember-assignation-timeout',
    language: 'es',
    subject: 'Esta actividad finaliza pronto',
    html: rememberActivityTimeout.es,
    type: getEmailTypes().active,
  });
  ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-remember-assignation-timeout',
    language: 'en',
    subject: 'This activity ends soon',
    html: rememberActivityTimeout.en,
    type: getEmailTypes().active,
  });

  ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-weekly-resume',
    language: 'es',
    subject: 'Aquí tienes tus actividades pendientes',
    html: userWeekly.es,
    type: getEmailTypes().active,
  });
  ctx.tx.call(emailsServiceAddIfNotExists, {
    templateName: 'user-weekly-resume',
    language: 'en',
    subject: 'Have a look to your pending activities',
    html: userWeekly.en,
    type: getEmailTypes().active,
  });

  ctx.tx.emit('init-emails');
}

// TODO: Implement cron job for sending emails

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: 'assignables.deploy',
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
      type: 'once-per-install',
      events: [
        'menu-builder.init-main-menu',
        'assignables.init-permissions',
        'multilanguage.newLocale',
      ],
      handler: async (ctx) => {
        const [mainItem, ...items] = menuItems;
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: mainItem,
          ctx,
        });
        ctx.tx.emit('init-menu');
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: items,
          ctx,
        });
        ctx.tx.emit('init-submenu');
      },
    },
  ],
  events: {
    /*
      New Deployment or plugin installation
    */
    'deployment-manager.install': async (ctx) => {
      // Widgets
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });

      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, '../i18n'),
        ctx,
      });

      // Email Templates
      await initEmails(ctx);
    },
    /*
      --- Academic Portfolio ---
    */
    'academic-portfolio.after-add-class-teacher': async (ctx) => {
      await afterAddClassTeacher({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-remove-classes-teachers': async (ctx) => {
      await afterRemoveClassesTeachers({ ...ctx.params, ctx });
    },
    'academic-portfolio.after-add-class-student': async (ctx) => {
      const {
        addStudentsToOpenInstancesWithClass,
        // eslint-disable-next-line global-require
      } = require('../core/assignations/addStudentToOpenInstancesWithClass');
      await addStudentsToOpenInstancesWithClass({ ...ctx.params, ctx });
    },

    /*
      --- Multilanguage ---
    */
    'multilanguage.newLocale': async (ctx) => {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, '../i18n'),
        ctx,
      });
    },
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
    },
  },
};
