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
const { permissions, menuItems, widgets } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'admin.init',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async function (ctx) {
      if (
        !hasKey(ctx.db.KeyValue, `widgets-zones`) ||
        process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
      ) {
        await Promise.allSettled(
          _.map(widgets.zones, (config) =>
            ctx.tx.call('widgets.widgets.setZone', {
              key: config.key,
              name: config.name,
              description: config.description,
            })
          )
        );
        await setKey(ctx.db.KeyValue, `widgets-zones`);
      }
      ctx.tx.emit('init-widget-zones');

      if (
        !hasKey(ctx.db.KeyValue, `widgets-items-zones`) ||
        process.env.RELOAD_WIDGETS_ON_EVERY_INSTALL === 'true'
      ) {
        await Promise.allSettled(
          _.map(widgets.items, (config) =>
            ctx.tx.call('widgets.widgets.setItemToZone', {
              zoneKey: config.zoneKey,
              key: config.key,
              url: config.url,
              name: config.name,
              description: config.description,
              properties: config.properties,
            })
          )
        );
        await setKey(ctx.db.KeyValue, `widgets-items-zones`);
      }

      ctx.tx.emit('init-widget-items');
    },
    'multilanguage:newLocale': async function (ctx) {
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
