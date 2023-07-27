/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocalesDeploy } = require('leemons-multilanguage');
const { hasKey, setKey } = require('leemons-mongodb-helpers');
const { getServiceModels } = require('../models');
const { defaultPermissions } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'dataset.deploy',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async function (ctx) {
      if (!(await hasKey(ctx.db.KeyValue, `permissions`))) {
        await ctx.call('users.permissions.addMany', defaultPermissions);
        await setKey(ctx.db.KeyValue, `permissions`);
      }
      ctx.emit('init-permissions');
    },
    'multilanguage.newLocale': async function newLocaleEvent(ctx) {
      await addLocalesDeploy({
        keyValueModel: ctx.db.KeyValue,
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
