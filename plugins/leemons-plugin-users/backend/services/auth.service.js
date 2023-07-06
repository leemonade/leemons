/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');
const { detailForJWT } = require('../core/users/jwt/detailForJWT');
const { hasPermissionCTX } = require('../core/users/hasPermissionCTX');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.auth',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    detailForJWT: {
      handler(ctx) {
        return detailForJWT({ ...ctx.params, ctx });
      },
    },
    hasPermissionCTX: {
      handler(ctx) {
        return hasPermissionCTX({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
