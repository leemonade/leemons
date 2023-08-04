/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/classes.rest');
const { classByIds, listSessionClasses, getBasicClassesByProgram } = require('../core/classes');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.classes',
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
    classByIds: {
      handler(ctx) {
        return classByIds({ ...ctx.params, ctx });
      },
    },
    getBasicClassesByProgram: {
      handler(ctx) {
        return getBasicClassesByProgram({ ...ctx.params, ctx });
      },
    },
    listSessionClasses: {
      handler(ctx) {
        // Note that it receives withProgram and _withProgram
        return listSessionClasses({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
