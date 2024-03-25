/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');

const path = require('path');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { addMenusDeploy } = require('@leemons/menu-builder');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { mainMenuKey } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'menu-builder.deploy',
  version: 1,
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
    'users.init-permissions': async (ctx) => {
      // Menu
      await addMenusDeploy({ keyValueModel: ctx.tx.db.KeyValue, menu: { key: mainMenuKey }, ctx });
      ctx.tx.emit('init-main-menu');
    },
  },
});
