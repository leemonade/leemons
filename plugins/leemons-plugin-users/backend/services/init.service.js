/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { usersModel } = require('../models');
const { testModel } = require('../models/test');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.init',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: { User: usersModel, Test: testModel },
    }),
    LeemonsDeploymentManagerMixin,
  ],
  events: {
    'deployment-manager.install': function (ctx) {
      console.log(ctx.db);
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
