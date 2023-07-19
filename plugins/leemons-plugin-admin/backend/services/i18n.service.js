/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');
const Rest = require('./i18n.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'admin.i18n',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
    Rest,
  ],
  actions: {},
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
