/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');

const { getServiceModels } = require('../models');
const restActions = require('./rest/widgets.rest');
const zoneServices = require('../core/widgetZone');
const { set: setZone } = require('../core/widgetZone/set');
const itemServices = require('../core/widgetItem');
const { set: setItem } = require('../core/widgetItem/set');

/** @type {ServiceSchema} */
module.exports = {
  name: 'widgets.widgets',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    // ---- WIDGET ZONES ----
    getZone: {
      handler(ctx) {
        return zoneServices.get({ ...ctx.params, ctx });
      },
    },
    addZone: {
      handler(ctx) {
        return zoneServices.add({ ...ctx.params, ctx });
      },
    },
    existsZone: {
      handler(ctx) {
        return zoneServices.exists({ ...ctx.params, ctx });
      },
    },
    updateZone: {
      handler(ctx) {
        return zoneServices.update({ ...ctx.params, ctx });
      },
    },
    deleteZone: {
      handler(ctx) {
        return zoneServices.remove({ ...ctx.params, ctx });
      },
    },
    setZone: {
      handler(ctx) {
        return setZone({ ...ctx.params, ctx });
      },
    },

    // ---- WIDGET ITEMS ----
    setItemToZone: {
      handler(ctx) {
        return setItem({ ...ctx.params, ctx });
      },
    },
    addItemToZone: {
      handler(ctx) {
        return itemServices.add({ ...ctx.params, ctx });
      },
    },
    existsItemInZone: {
      handler(ctx) {
        return itemServices.exists({ ...ctx.params, ctx });
      },
    },
    updateItemInZone: {
      handler(ctx) {
        return itemServices.update({ ...ctx.params, ctx });
      },
    },
    deleteItemInZone: {
      handler(ctx) {
        return itemServices.remove({ ...ctx.params, ctx });
      },
    },
    updateOrderItemsInZone: {
      handler(ctx) {
        return itemServices.updateOrders({ ...ctx.params, ctx });
      },
    },
    updateProfileItemsInZone: {
      handler(ctx) {
        return itemServices.updateProfiles({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
