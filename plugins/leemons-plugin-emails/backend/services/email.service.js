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
const restActions = require('./rest/email.rest');

const emailService = require('../core/email');

/** @type {ServiceSchema} */
module.exports = {
  name: 'emails.email',
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
        return emailService.add({ ...ctx.params, ctx });
      },
    },
    send: {
      handler(ctx) {
        return emailService.send({ ...ctx.params });
      },
    },
    delete: {
      handler(ctx) {
        return emailService.delete({ ...ctx.params, ctx });
      },
    },
    providers: {
      handler(ctx) {
        return emailService.providers({ ctx });
      },
    },
    deleteAll: {
      handler(ctx) {
        return emailService.deleteAll({ ...ctx.params, ctx });
      },
    },
    addProvider: {
      handler(ctx) {
        return emailService.saveProvider({ ...ctx.params, ctx });
      },
    },
    saveProvider: {
      handler(ctx) {
        return emailService.saveProvider({ ...ctx.params, ctx });
      },
    },
    addIfNotExist: {
      handler(ctx) {
        return emailService.addIfNotExist({ ...ctx.params, ctx });
      },
    },
    sendAsPlatform: {
      handler(ctx) {
        return emailService.sendAsPlatform({ ...ctx.params, ctx });
      },
    },
    sendAsEducationalCenter: {
      handler(ctx) {
        return emailService.sendAsEducationalCenter({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
