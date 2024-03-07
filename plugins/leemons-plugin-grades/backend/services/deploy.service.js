/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { permissions, menuItems } = require('../config/constants');
const { getServiceModels } = require('../models');

async function addMenuItems(ctx) {
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
}

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'grades.deploy',
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
      events: ['menu-builder.init-main-menu', 'grades.init-permissions'],
      handler: async (ctx) => addMenuItems(ctx),
    },
  ],
  events: {
    'deployment-manager.config-change': async (ctx) => addMenuItems(ctx),

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
