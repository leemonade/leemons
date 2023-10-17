/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/socket.rest');
const { setConfig, emit, emitToAll } = require('../core/socket');

/** @type {ServiceSchema} */
module.exports = {
  name: 'mqtt-aws-iot.socket',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      autoDeploymentID: false,
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    setConfig: {
      handler(ctx) {
        return setConfig({ data: ctx.params, ctx });
      },
    },
    emit: {
      handler(ctx) {
        return emit({ ...ctx.params, ctx });
      },
    },
    emitToAll: {
      handler(ctx) {
        return emitToAll({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
