/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/class.rest');
const {
  classByIds,
  getBasicClassesByProgram,
  listSessionClasses,
  addClass,
  addClassStudentsMany,
  listClasses,
  getClassesUnderProgram,
  getClassesUnderProgramCourse,
  getTeachersByClass,
} = require('../core/classes');
const { getByClassAndUserAgent } = require('../core/classes/student/getByClassAndUserAgent');
const { getByClass } = require('../core/classes/student/getByClass');
const { add: addTeacher } = require('../core/classes/teacher/add');
const { removeByClass: removeTeachersByClass } = require('../core/classes/teacher/removeByClass');

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
    addClass: {
      handler(ctx) {
        return addClass({ ...ctx.params, ctx });
      },
    },
    addTeacher: {
      handler(ctx) {
        return addTeacher({ ...ctx.params, ctx });
      },
    },
    removeTeachersByClass: {
      handler(ctx) {
        return removeTeachersByClass({ ...ctx.params, ctx });
      },
    },
    addStudentsToClasses: {
      handler(ctx) {
        return addClassStudentsMany({ ...ctx.params, ctx });
      },
    },
    listClasses: {
      handler(ctx) {
        return listClasses({ ...ctx.params, ctx });
      },
    },
    getClassesUnderProgram: {
      handler(ctx) {
        return getClassesUnderProgram({ ...ctx.params, ctx });
      },
    },
    getClassesUnderProgramCourse: {
      handler(ctx) {
        return getClassesUnderProgramCourse({ ...ctx.params, ctx });
      },
    },
    'student.getByClassAndUserAgent': {
      handler(ctx) {
        return getByClassAndUserAgent({ ...ctx.params, ctx });
      },
    },
    'student.getByClass': {
      handler(ctx) {
        return getByClass({ ...ctx.params, ctx });
      },
    },
    'teacher.getByClass': {
      handler(ctx) {
        return getTeachersByClass({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
