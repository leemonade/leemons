/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/room.rest');
const {
  add,
  get,
  exist,
  update,
  getMessages,
  addUserAgents,
  existUserAgent,
  removeUserAgents,
  getUserAgentRooms,
  getRoomsMessageCount,
  getUnreadMessages,
} = require('../core/room');

/** @type {ServiceSchema} */
module.exports = {
  name: 'comunica.room',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    add: {
      handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    get: {
      handler(ctx) {
        return get({ ...ctx.params, ctx });
      },
    },
    exists: {
      handler(ctx) {
        return exist({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    getMessages: {
      handler(ctx) {
        return getMessages({ ...ctx.params, ctx });
      },
    },
    addUserAgents: {
      handler(ctx) {
        return addUserAgents({ ...ctx.params, ctx });
      },
    },
    existUserAgent: {
      handler(ctx) {
        return existUserAgent({ ...ctx.params, ctx });
      },
    },
    removeUserAgents: {
      handler(ctx) {
        return removeUserAgents({ ...ctx.params, ctx });
      },
    },
    getUserAgentRooms: {
      handler(ctx) {
        return getUserAgentRooms({ ...ctx.params, ctx });
      },
    },
    getRoomsMessageCount: {
      handler(ctx) {
        return getRoomsMessageCount({ ...ctx.params, ctx });
      },
    },
    getUnreadMessages: {
      handler(ctx) {
        return getUnreadMessages({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
