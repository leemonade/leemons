/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');
const {
  onAcademicPortfolioAddClass,
} = require('../core/pluginEvents/class/onAcademicPortfolioAddClass');
const restActions = require('./rest/calendar.pluginEvents.class.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'calendar.pluginEvents.class',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    // onAcademicPortfolioAddClass,
    onAcademicPortfolioAddClass: {
      handler(ctx) {
        onAcademicPortfolioAddClass(...ctx.params, ctx);
      },
    },
    // onAcademicPortfolioUpdateClass,
    // onAcademicPortfolioRemoveClasses,
    // onAcademicPortfolioAddClassStudent,
    // onAcademicPortfolioAddClassTeacher,
    // onAcademicPortfolioRemoveClassStudents,
    // onAcademicPortfolioRemoveClassTeachers,
    // onAcademicPortfolioRemoveStudentFromClass,
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
