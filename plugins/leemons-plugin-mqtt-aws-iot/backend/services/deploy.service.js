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
const { permissions, widgets } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'mqtt-aws-iot.deploy',
  version: 1,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['es', 'en'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      autoDeploymentID: false,
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [],
  events: {
    // Widget items
    'admin.init-widget-zones': async (ctx) => {
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
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
