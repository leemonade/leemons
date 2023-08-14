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
const { addMenuItemsDeploy } = require('leemons-menu-builder');
const { permissions, menuItems } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'curriculum.deploy',
  version: 1,
  mixins: [
    LeemonsMultiEventsMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  multiEvents: [
    {
      events: ['users.init-menu', 'curriculum.init-permissions'],
      handler: async (ctx) => {
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
      },
    },
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
    // Permissions
    'users.init-permissions': async (ctx) => {
      await addPermissionsDeploy({
        keyValueModel: ctx.tx.db.KeyValue,
        permissions,
        ctx,
      });
    },
    'users.profile-permissions-change': async (ctx) => {
      const {
        onProfilePermissionsChange,
        // eslint-disable-next-line global-require
      } = require('../core/configs/onProfilePermissionsChange');
      await onProfilePermissionsChange({ ...ctx.params, ctx });
      ctx.tx.emit('permissions-change');
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
