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
// const { addMenuItemsDeploy } = require('@leemons/menu-builder');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { permissions } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'timetable.deploy',
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
  //! Comentado porque aparecía comentado en el "viejo" events.js
  // multiEvents: [
  //   {
  //     type: 'once-per-install',
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
    'users.init-permissions': async (ctx) => {
      // Permissions
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions: permissions.permissions,
        ctx,
      });
    },
  },
});
