/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/programs.rest');

// addProgram,
const { addProgram } = require('../core/programs/addProgram');
// listPrograms,
const { listPrograms } = require('../core/programs/listPrograms');
// programsByIds,
const { programsByIds } = require('../core/programs/programsByIds');
// getUserPrograms,
const { getUserPrograms } = require('../core/programs/getUserPrograms');
// getProgramCenters,
const { getProgramCenters } = require('../core/programs/getProgramCenters');
// programsByCenters,
const { programsByCenters } = require('../core/programs/programsByCenters');
// getUsersInProgram,
const { getUsersInProgram } = require('../core/programs/getUsersInProgram');
// isUserInsideProgram,
const { isUserInsideProgram } = require('../core/programs/isUserInsideProgram');
// getProgramEvaluationSystem,
const { getProgramEvaluationSystem } = require('../core/programs/getProgramEvaluationSystem');
const { LeemonsMQTTMixin } = require('leemons-mqtt');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.programs',
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
    addProgram: {
      handler(ctx) {
        return addProgram({ ...ctx.params, ctx });
      },
    },
    listPrograms: {
      handler(ctx) {
        return listPrograms({ ...ctx.params, ctx });
      },
    },
    programsByIds: {
      handler(ctx) {
        return programsByIds({ ...ctx.params, ctx });
      },
    },
    getUserPrograms: {
      handler(ctx) {
        return getUserPrograms({ ...ctx.params, ctx });
      },
    },
    getProgramCenters: {
      handler(ctx) {
        return getProgramCenters({ ...ctx.params, ctx });
      },
    },
    programsByCenters: {
      handler(ctx) {
        return programsByCenters({ ...ctx.params, ctx });
      },
    },
    getUsersInProgram: {
      handler(ctx) {
        return getUsersInProgram({ ...ctx.params, ctx });
      },
    },
    isUserInsideProgram: {
      handler(ctx) {
        return isUserInsideProgram({ ...ctx.params, ctx });
      },
    },
    getProgramEvaluationSystem: {
      handler(ctx) {
        return getProgramEvaluationSystem({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
