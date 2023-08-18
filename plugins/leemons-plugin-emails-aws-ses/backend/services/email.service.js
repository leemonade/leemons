/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');

const emailService = require('../core/email');

/** @type {ServiceSchema} */
module.exports = {
  name: 'emails-aws-ses.email',
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
    saveConfig: {
      handler(ctx) {
        return emailService.saveConfig({ ...ctx.params, ctx });
      },
    },
    removeConfig: {
      handler(ctx) {
        return emailService.removeConfig({ ...ctx.params, ctx });
      },
    },
    getProviders: {
      handler(ctx) {
        return emailService.getProviders({ ...ctx.params, ctx });
      },
    },
    sendMail: {
      handler(ctx) {
        return emailService.sendMail({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
