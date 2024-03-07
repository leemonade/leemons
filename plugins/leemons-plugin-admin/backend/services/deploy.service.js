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
  name: 'admin.deploy',
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
      events: ['menu-builder.init-main-menu', 'multilanguage.newLocale'],
      handler: async (ctx) => {
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: menuItems,
          ctx,
        });
      },
    },
    // Permissions
    {
      type: 'once-per-install',
      events: [
        'users.init-permissions',
        'dataset.init-permissions',
        'calendar.init-permissions',
        'leebrary.init-permissions',
      ],
      handler: async (ctx) => {
        await addPermissionsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          permissions: permissions.permissions,
          ctx,
        });
      },
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Widgets
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
    },
  },
});
