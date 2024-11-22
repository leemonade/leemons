/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addWidgetZonesDeploy } = require('@leemons/widgets');
const path = require('path');

const { PLUGIN_NAME, VERSION, widgets } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${PLUGIN_NAME}.deploy`,
  version: VERSION,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['es', 'en'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Widgets
      await addWidgetZonesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        zones: widgets.zones,
        ctx,
      });
    },
  },
});
