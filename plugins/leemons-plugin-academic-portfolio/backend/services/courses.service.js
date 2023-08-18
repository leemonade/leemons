/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/course.rest');
const { addCourse } = require('../core/courses/addCourse');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.courses',
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
    addCourse: {
      handler(ctx) {
        return addCourse({ ...ctx.params, ctx });
      },
    },
    getCourseName: {
      handler(ctx) {
        const { item } = ctx.params;
        return item.name ? `${item.name}` : `${item.index}º`;
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
