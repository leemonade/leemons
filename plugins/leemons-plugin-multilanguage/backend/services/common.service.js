/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { commonModel, localesModel, contentsModel } = require('../models');

require('../core/localization/create');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage-common',
  mixins: [
    LeemonsMongoDBMixin({
      models: {
        Common: commonModel,
        Locales: localesModel,
        Contents: contentsModel,
      },
    }),
  ],

  actions: {
    /**
     * Say a 'Hello' action.
     *
     * @returns
     */
    hello: {
      rest: {
        method: 'GET',
        path: '/hello',
      },
      async handler(ctx) {
        // const test = await ctx.tx.db.Test.create({ name: "miau" });
        // throw new Error("miau");
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
