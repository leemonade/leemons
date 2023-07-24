/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const getDefaultLocale = require('../core/platform/getDefaultLocale');
const Rest = require('./platform.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.platform',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
    Rest,
  ],

  actions: {
    getDefaultLocale: {
      async handler(ctx) {
        return getDefaultLocale({ ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
