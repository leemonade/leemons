"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require("leemons-mongodb");
const { usersModel } = require("../models");
const { testModel } = require("../models/test");

/** @type {ServiceSchema} */
module.exports = (broker) => {
  return {
    name: "greeter",
    mixins: [
      LeemonsMongoDBMixin({
        autoRollback: true,
        autoDeploymentID: true,
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
          method: "GET",
          path: "/hello",
        },
        async handler(ctx) {
          ctx.meta.deploymentID = "miau";
          ctx.meta.transactionID = "6466385cb3aa7003f515da32";
          const r = await ctx.call("transactions.new");
          console.log(r);
          /*
          const test = await ctx.db.Test.create({ name: "Prueba" });
          console.log(
            "toma consulta",
            await ctx.db.Test.findOne({ _id: test._id }).select("name").lean()
          );
          await ctx.db.Test.findByIdAndUpdate(test._id, { name: "toma ya" });
          // await ctx.db.Test.findByIdAndDelete(test._id);
          return "Hello Moleculer";
          */
        },
      },

      /**
       * Welcome, a username
       *
       * @param {String} name - User name
       */
      welcome: {
        rest: "/welcome",
        params: {
          name: "string",
        },
        /** @param {Context} ctx  */
        async handler(ctx) {
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
    },

    /**
     * Service started lifecycle event handler
     */
    async started() {},

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {},
  };
};
