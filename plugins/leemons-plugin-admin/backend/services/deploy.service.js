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
const { widgets, permissions } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'admin.deploy',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async function (ctx) {
      // Widgets
      if (
        !(await hasKey(ctx.db.KeyValue, `widgets-zones`)) ||
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
        !(await hasKey(ctx.db.KeyValue, `widgets-items-zones`)) ||
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

      // Permissions
      if (!(await hasKey(ctx.db.KeyValue, `permissions`))) {
        await ctx.call('users.permissions.addMany', permissions.permissions);
        await setKey(ctx.db.KeyValue, `permissions`);
      }
      ctx.emit('init-permissions');
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
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
