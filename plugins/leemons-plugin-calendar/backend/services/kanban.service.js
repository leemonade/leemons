/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const mongoose = require('mongoose');
const { getServiceModels } = require('../models');
const kanbanColumns = require('../core/kanban-columns');
const kanbanEventOrders = require('../core/kanban-event-orders');

/** @type {ServiceSchema} */
module.exports = {
  name: 'calendar.kanban',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    listColumns: {
      handler(ctx) {
        return kanbanColumns.list({ ...ctx.params, ctx });
      },
    },
    listEventOrders: {
      handler(ctx) {
        return kanbanEventOrders.list({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
