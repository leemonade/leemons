"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = (broker) => {
  return {
    name: "greeteree",

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
          method: "POST",
          path: "/CREA_USURIA",
        },
        async handler(ctx) {
          broker.sendToChannel(
            "hello.call",
            { gatitos: "powa" },
            { persistent: true }
          );
          return "Hello Moleculer";
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
          ctx.call("greeter.hello", { pepe: "qwd" });
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
    created() {},

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
