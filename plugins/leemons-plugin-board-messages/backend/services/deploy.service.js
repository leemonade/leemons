/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('@leemons/widgets');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { widgets, permissions, menuItems } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'board-messages.deploy',
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
      events: ['dashboard.init-widget-zones', 'academic-portfolio.init-widget-zones'],
      handler: async (ctx) => {
        await addWidgetZonesDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          zones: widgets.zones,
          ctx,
        });
        await addWidgetItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          items: widgets.items,
          ctx,
        });
      },
    },
    {
      type: 'once-per-install',
      events: ['menu-builder.init-main-menu', 'board-messages.init-permissions'],
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
  ],
  events: {
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },
  },
});
