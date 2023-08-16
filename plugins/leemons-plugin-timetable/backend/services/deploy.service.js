/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { addPermissionsDeploy } = require('leemons-permissions');

const { LeemonsMultiEventsMixin } = require('leemons-multi-events');
// const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { permissions } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'timetable.deploy',
  version: 1,
  mixins: [
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  //! Comentado porque aparecía comentado en el "viejo" events.js
  // multiEvents: [
  //   {
  //     events: ['menu-builder.init-main-menu', 'timetable.init-permissions'],
  //     handler: async (ctx) => {
  // await addMenuItemsDeploy({
  //   keyValueModel: ctx.tx.db.KeyValue,
  //   item: menuItems,
  //   ctx,
  // });
  //     },
  //   },
  // ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Locales
      await addLocalesDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        locale: ['es', 'en'],
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
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
      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
