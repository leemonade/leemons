/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/knowledge.rest');
const { addKnowledgeArea } = require('../core/knowledges');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.knowledges',
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
    addKnowledge: {
      handler(ctx) {
        return addKnowledgeArea({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
