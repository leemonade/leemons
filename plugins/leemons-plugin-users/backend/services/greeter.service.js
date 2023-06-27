/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.greeter',
  version: 2,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
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
        /*
        const test = await ctx.tx.db.Actions.findOneAndUpdate(
          {
            actionName: 'FLIPAS66',
          },
          { order: 66 },
          { upsert: true }
        );
        console.log(test);
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
        return `Welcome, ${new Date() - ctx.params.n}`;
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
};
