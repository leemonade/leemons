/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addPermissionsDeploy } = require('@leemons/permissions');
const { addWidgetItemsDeploy } = require('@leemons/widgets');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { hasKey, setKey } = require('@leemons/mongodb-helpers');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { widgets, permissions, menuItems, datasetLocations } = require('../config/constants');
const { getServiceModels } = require('../models');

const initDataset = async ({ ctx }) => {
  if (!(await hasKey(ctx.tx.db.KeyValue, 'dataset-locations'))) {
    await Promise.all(
      _.map(datasetLocations, (config) => ctx.tx.call('dataset.dataset.addLocation', config))
    );
    await setKey(ctx.tx.db.KeyValue, 'dataset-locations');
  }
  ctx.tx.emit('init-dataset-locations');
};

async function addMenuItems(ctx) {
  await addMenuItemsDeploy({
    keyValueModel: ctx.tx.db.KeyValue,
    item: menuItems,
    ctx,
  });
  ctx.tx.emit('init-menu');
}

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'families.deploy',
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
      events: ['users.init-menu', 'families.init-permissions'],
      handler: async (ctx) => addMenuItems(ctx),
    },
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Dataset
      await initDataset({ ctx });
    },
    'deployment-manager.config-change': async (ctx) => addMenuItems(ctx),
    // Widget items
    'users.init-widget-zones': async (ctx) => {
      await addWidgetItemsDeploy({ keyValueModel: ctx.tx.db.KeyValue, items: widgets.items, ctx });
    },
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
