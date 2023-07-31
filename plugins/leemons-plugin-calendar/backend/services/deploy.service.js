/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { addPermissionsDeploy } = require('leemons-permissions');
const { addWidgetZonesDeploy, addWidgetItemsDeploy } = require('leemons-widgets');
const { getServiceModels } = require('../models');
const { permissions, widgets } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'calendar.deploy',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
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
    },
    'dashboard.init-widget-zones': async (ctx) => {
      await addWidgetZonesDeploy({ keyValueModel: ctx.tx.db.KeyValue, zones: widgets.zones, ctx });
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
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
