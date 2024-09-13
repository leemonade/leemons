/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

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
const { getByClass } = require('../core/classes/student/getByClass');
const { getByClassAndUserAgent } = require('../core/classes/student/getByClassAndUserAgent');
const { add: addTeacher } = require('../core/classes/teacher/add');
const { removeByClass: removeTeachersByClass } = require('../core/classes/teacher/removeByClass');
const { getServiceModels } = require('../models');

const restActions = require('./rest/class.rest');

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
    LeemonsMQTTMixin(),
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
    studentGetByClassAndUserAgent: {
      handler(ctx) {
        return getByClassAndUserAgent({ ...ctx.params, ctx });
      },
    },
    studentGetByClass: {
      handler(ctx) {
        return getByClass({ ...ctx.params, ctx });
      },
    },
    teacherGetByClass: {
      handler(ctx) {
        return getTeachersByClass({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
