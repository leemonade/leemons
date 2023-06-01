/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const path = require('path');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { addLocales } = require('leemons-multilanguage');
const { getKeyValueModel, hasKey } = require('leemons-mongodb-helpers');
const { usersModel } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.init',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: { User: usersModel, KeyValue: getKeyValueModel({ modelName: 'users_KeyValue' }) },
    }),
    LeemonsDeploymentManagerMixin,
  ],
  events: {
    'multilanguage:newLocale': function (ctx) {
      if (
        !hasKey(ctx.db.KeyValue, `locale-${ctx.params.locale.code}-configured`) ||
        process.env.RELOAD_I18N_ON_EVERY_INSTALL === 'true'
      ) {
        return addLocales({
          ctx,
          locales: ctx.params.locale.code,
          i18nPath: path.resolve(__dirname, `../i18n/`),
        });
      }
      return null;
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
