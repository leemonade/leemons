/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const {
  LeemonsMiddlewaresMixin,
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getAddCustomTranslationKeysAction } = require('@leemons/multilanguage');

const { addProgram } = require('../core/programs/addProgram');
const { getProgramCenters } = require('../core/programs/getProgramCenters');
const { getProgramEvaluationSystem } = require('../core/programs/getProgramEvaluationSystem');
const { getUserPrograms } = require('../core/programs/getUserPrograms');
const { getUsersInProgram } = require('../core/programs/getUsersInProgram');
const { isUserInsideProgram } = require('../core/programs/isUserInsideProgram');
const { listPrograms } = require('../core/programs/listPrograms');
const { programsByCenters } = require('../core/programs/programsByCenters');
const { programsByIds } = require('../core/programs/programsByIds');
const { getServiceModels } = require('../models');

const restActions = require('./rest/programs.rest');

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
    ...getAddCustomTranslationKeysAction({
      middlewares: [
        LeemonsMiddlewareAuthenticated(),
        LeemonsMiddlewareNecessaryPermits({
          allowedPermissions: {
            'academic-portfolio.programs': {
              actions: ['admin', 'create', 'update'],
            },
          },
        }),
      ],
    }),
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
    // mongoose.connect(process.env.MONGO_URI);
  },
};
