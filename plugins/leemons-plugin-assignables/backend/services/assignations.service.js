/** @type {import('moleculer').ServiceSchema} */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { getServiceModels } = require('../models');
const { createAssignation } = require('../core/assignations/createAssignation');
const { getAssignation } = require('../core/assignations/getAssignation');
const { getAssignations } = require('../core/assignations/getAssignations');
const { updateAssignation } = require('../core/assignations/updateAssignation');
const { getUserDataForFundae } = require('../core/assignations/getUserDataForFundae');
const restActions = require('./rest/assignations.rest');

module.exports = {
  name: 'assignables.assignations',
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
    createAssignation: {
      handler(ctx) {
        return createAssignation({ ...ctx.params, ctx });
      },
    },
    getAssignation: {
      handler(ctx) {
        return getAssignation({ ...ctx.params, ctx });
      },
    },
    getAssignations: {
      handler(ctx) {
        return getAssignations({ ...ctx.params, ctx });
      },
    },
    updateAssignation: {
      handler(ctx) {
        return updateAssignation({ ...ctx.params, ctx });
      },
    },
    getUserDataForFundae: {
      handler(ctx) {
        return getUserDataForFundae({ ...ctx.params, ctx });
      },
    },
  },
  // Esto debe eliminarse una vez hecho el merge a microservices/dev
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
