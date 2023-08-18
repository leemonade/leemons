const path = require('path');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { LeemonsMultiEventsMixin } = require('leemons-multi-events');
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('leemons-widgets');
const { addPermissionsDeploy } = require('leemons-permissions');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
const { menuItems, widgets, permissions } = require('../config/constants');
const { getServiceModels } = require('../models');

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
      events: ['menu-builder.init-main-menu', 'multilanguage.newLocale'],
      handler: async (ctx) => {
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: menuItems,
          ctx,
        });
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

      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });

      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, '../i18n'),
        ctx,
      });
    },
    /*
      --- Academic Portfolio ---
    */
    'academic-portfolio.after-add-class-teacher': async (ctx) => {
      // TODO: Implement this event (after-add-class-teacher)
    },
    'academic-portfolio.after-remove-classes-teachers': async (ctx) => {
      // TODO: Implement this event (after-temove-classes-teachers)
    },
    'academic-portfolio.after-add-class-student': async (ctx) => {
      // TODO: Implement this event (after-add-class-student)
    },

    /*
      --- Emails ---
    */
    'emails.': async (ctx) => {
      // TODO: Implement this event (emails plugin ready)
    },

    /*
      --- Multilanguage ---
    */
    'multilanguage.newLocale': async (ctx) => {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, '../i18n'),
      });
    },
  },
};
