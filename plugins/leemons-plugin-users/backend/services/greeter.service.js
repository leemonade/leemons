/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { usersModel } = require('../models');
const { testModel } = require('../models/test');

/** @type {ServiceSchema} */
module.exports = (broker) => ({
  name: 'users.greeter',
  mixins: [
    LeemonsMongoDBMixin({
      models: { User: usersModel, Test: testModel },
    }),
  ],

  /**
   * Settings
   */
  settings: {},

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   */
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
        return await ctx.call('users.greeter.welcome', { name: 'miau' });
        // const test = await ctx.tx.db.Test.create({ name: "miau" });
        /*
          const test = await ctx.tx.db.Test.findByIdAndUpdate(
            "646b5caf489258370109cae1",
            { name: "pepito mola" }
          );
          */
        // throw new Error("miau");
      },
    },

    /**
     * Welcome, a username
     *
     * @param {String} name - User name
     */
    welcome: {
      rest: '/welcome',
      params: {
        name: 'string',
      },
      /** @param {Context} ctx  */
      async handler(ctx) {
        console.log(ctx.params);
        return `Welcome, ${ctx.params.name}`;
      },
    },
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {},

  /**
   * Service created lifecycle event handler
   */
  created() {
    mongoose.connect(process.env.MONGO_URI);
    console.log(this);
    // this.use(myMiddleware);
  },

  /**
   * Service started lifecycle event handler
   */
  async started() {
    // console.log(this.broker.services);
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {},
});
