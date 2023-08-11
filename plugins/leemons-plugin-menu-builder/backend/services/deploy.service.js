/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { addMenusDeploy } = require('leemons-menu-builder');
const { getServiceModels } = require('../models');
const { mainMenuKey } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'menu-builder.deploy',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
    },
    'multilanguage.newLocale': async (ctx) => {
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
    },
    'users.init-permissions': async (ctx) => {
      // Menu
      await addMenusDeploy({ keyValueModel: ctx.tx.db.KeyValue, menu: { key: mainMenuKey }, ctx });
      ctx.tx.emit('init-main-menu');
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
