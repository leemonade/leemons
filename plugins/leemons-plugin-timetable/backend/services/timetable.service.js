/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const { getServiceModels } = require('../models');
const listByClassIds = require('../core/timetables/listByClassIds');
const create = require('../core/timetables/create');
const get = require('../core/timetables/get');
const count = require('../core/timetables/count');
const update = require('../core/timetables/update');
const deleteOne = require('../core/timetables/delete');
const getWeekdays = require('../core/helpers/dayjs/getWeekdays');
const restActions = require('./rest/timetable.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'timetable.timetable',
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
    create: {
      handler(ctx) {
        return create({ ...ctx.params, ctx });
      },
    },
    get: {
      handler(ctx) {
        return get({ ...ctx.params, ctx });
      },
    },
    count: {
      handler(ctx) {
        return count({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    delete: {
      handler(ctx) {
        return deleteOne({ ...ctx.params, ctx });
      },
    },
    listByClassIds: {
      handler(ctx) {
        return listByClassIds({ ...ctx.params, ctx });
      },
    },
    getWeekdays: {
      handler(ctx) {
        return getWeekdays({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
