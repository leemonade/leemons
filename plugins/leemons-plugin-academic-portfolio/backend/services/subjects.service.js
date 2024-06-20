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
const restActions = require('./rest/subject.rest');
const { getTeachersBySubjects, getSubjectCredits, addSubject } = require('../core/subjects');
const { subjectByIds } = require('../core/subjects');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.subjects',
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
    getTeachersBySubjects: {
      handler(ctx) {
        return getTeachersBySubjects({ ...ctx.params, ctx });
      },
    },
    getSubjectCredits: {
      handler(ctx) {
        return getSubjectCredits({ ...ctx.params, ctx });
      },
    },
    addSubject: {
      handler(ctx) {
        return addSubject({ ...ctx.params, ctx });
      },
    },
    subjectsByIds: {
      handler(ctx) {
        const { ids, shouldPrepareAssets, ...filters } = ctx.params;
        return subjectByIds({
          ids: Array.isArray(ids) ? ids : [ids],
          ...filters,
          shouldPrepareAssets,
          ctx,
        });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
