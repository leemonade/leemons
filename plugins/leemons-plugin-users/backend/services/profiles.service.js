/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const { saveBySysName } = require('../core/profiles');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.profiles',
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
    // saveBySysName: profiles.saveBySysName,
    saveBySysName: {
      handler(ctx) {
        return saveBySysName({ ...ctx.params });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
