/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { registerAssignableRolesDeploy } = require('@leemons/academic-portfolio');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { addMenuItemsDeploy, addMenusDeploy } = require('@leemons/menu-builder');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('@leemons/widgets');
const { find, isEmpty } = require('lodash');
const path = require('path');

const { defaultCategory: defaultCategoryKey } = require('../config/config');
const {
  permissions,
  menuItems,
  pluginName,
  categories,
  categoriesMenu,
  widgets,
  assignableRoles,
} = require('../config/constants');
const { add } = require('../core/categories/add');
const { setDefaultCategory } = require('../core/settings');
const { getServiceModels } = require('../models');

async function addDefaultCategories({ ctx }) {
  const initialCategories = await Promise.all(
    categories.map((category) => add({ data: category, ctx: { ...ctx, callerPlugin: pluginName } }))
  );
  const defaultCategory = find(initialCategories, { key: defaultCategoryKey });
  if (!isEmpty(defaultCategory)) {
    await setDefaultCategory({
      categoryId: defaultCategory.id,
      ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
    });
  }
}

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${pluginName}.deploy`,
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
      events: ['menu-builder.init-main-menu', `${pluginName}.init-permissions`],
      handler: async (ctx) => {
        // Adds item to Main menu
        await addMenuItemsDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          item: menuItems,
          ctx,
        });
        // Create Categories Menu
        await addMenusDeploy({
          keyValueModel: ctx.tx.db.KeyValue,
          menu: categoriesMenu,
          ctx,
        });
        ctx.tx.emit('init-menu');
        await addDefaultCategories({ ctx });
        ctx.tx.emit('init-categories');
      },
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Register widget zone
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
      ctx.emit('init-widget-zones')
    },
    'admin.init-widget-zones': async (ctx) => {
      // Widgets
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
      ctx.emit('init-widgets')
    },
    'users.init-permissions': async (ctx) => {
      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });

      ctx.tx.emit('init-library-categories-menu');
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
