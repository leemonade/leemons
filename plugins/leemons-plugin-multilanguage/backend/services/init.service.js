/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocales } = require('leemons-multilanguage');
const { getKeyValueModel, hasKey } = require('leemons-mongodb-helpers');
const { commonModel, localesModel, contentsModel } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.init',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: {
        Common: commonModel,
        Locales: localesModel,
        Contents: contentsModel,
        KeyValue: getKeyValueModel({ modelName: 'users_KeyValue' }),
      },
    }),
    LeemonsDeploymentManagerMixin,
  ],
  events: {
    'deployment-manager.install': function (ctx) {},
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
});
