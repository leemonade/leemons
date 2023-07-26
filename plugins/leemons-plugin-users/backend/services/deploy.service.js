/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocales, addLocalesDeploy } = require('leemons-multilanguage');
const { hasKey, setKey } = require('leemons-mongodb-helpers');
const { getServiceModels } = require('../models');
const { addMany } = require('../core/actions');
const { defaultActions, defaultPermissions } = require('../config/constants');
const {
  createInitialProfiles,
} = require('../core/profiles/createInitialProfiles/createInitialProfiles');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.deploy',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async function (ctx) {
      if (!(await hasKey(ctx.db.KeyValue, `actions`))) {
        await addMany({ data: defaultActions, ctx });
        await setKey(ctx.db.KeyValue, `actions`);
      }
      ctx.emit('init-actions');
      if (!(await hasKey(ctx.db.KeyValue, `permissions`))) {
        await ctx.call('users.permissions.addMany', defaultPermissions);
        await setKey(ctx.db.KeyValue, `permissions`);
      }
      ctx.emit('init-permissions');
    },
    'users.change-platform-locale': async function (ctx) {
      await createInitialProfiles({ ctx });
    },
    'multilanguage.newLocale': async function (ctx) {
      await addLocalesDeploy({
        keyValueModel: ctx.db.KeyValue,
        locale: ctx.params.code,
        i18nPath: path.resolve(__dirname, `../i18n/`),
        ctx,
      });
      return null;
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
