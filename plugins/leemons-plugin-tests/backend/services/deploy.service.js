/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { registerAssignableRolesDeploy } = require('@leemons/academic-portfolio');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { addCategoryDeploy } = require('@leemons/library');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('@leemons/widgets');
const path = require('path');

const {
  permissions,
  assignableRoles,
  menuItems,
  libraryQuestionBankCategory,
  widgets,
} = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'tests.deploy',
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
      events: ['menu-builder.init-main-menu', 'academic-portfolio.init-permissions'],
      handler: async (ctx) => {
        const [mainMenuItem, ...otherMenuItems] = menuItems;
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: mainMenuItem,
          ctx,
        });
        ctx.tx.emit('init-menu');
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: otherMenuItems,
          ctx,
        });
        ctx.tx.emit('init-submenu');
      },
    },
    {
      type: 'once-per-install',
      events: ['leebrary.init-categories', 'tests.init-permissions'],
      handler: async (ctx) => {
        // Library categories
        await addCategoryDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          category: libraryQuestionBankCategory,
          ctx,
        });
      },
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      await ctx.tx.call('leebrary.providers.register', {
        name: 'Library Test (Question banks)',
        supportedMethods: {
          getByIds: true,
        },
      });

      // Register widget zone
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      ctx.emit('init-widget-zones');
    },
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },
    'assignables.init-plugin': async (ctx) => {
      await registerAssignableRolesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        assignableRoles,
        ctx,
      });
    },
  },
});
