/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const path = require('path');
const { addLocales } = require('leemons-multilanguage');
const { hasKey, setKey } = require('leemons-mongodb-helpers');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'emails.deploy',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'multilanguage:newLocale': async function newLocaleEvent(ctx) {
      if (
        !hasKey(ctx.db.KeyValue, `locale-${ctx.params.locale.code}-configured`) ||
        process.env.RELOAD_I18N_ON_EVERY_INSTALL === 'true'
      ) {
        await addLocales({
          ctx,
          locales: ctx.params.locale.code,
          i18nPath: path.resolve(__dirname, `../i18n/`),
        });
        await setKey(ctx.db.KeyValue, `locale-${ctx.params.locale.code}-configured`);
      }
      return null;
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
