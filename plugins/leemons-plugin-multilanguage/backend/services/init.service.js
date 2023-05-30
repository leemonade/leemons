/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { commonModel, localesModel, contentsModel } = require('../models');
const localization = require('../core/localization');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.init',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: {
        Common: commonModel,
        Locales: localesModel,
        Contents: contentsModel,
      },
    }),
    LeemonsDeploymentManagerMixin,
  ],
  events: {
    'deployment-manager.install': function (ctx) {
      console.log('User event:', ctx.meta);
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
