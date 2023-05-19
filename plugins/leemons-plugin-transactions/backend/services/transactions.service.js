"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const mongoose = require("mongoose");

/** @type {ServiceSchema} */
module.exports = (broker) => {
  return {
    name: "transactions",

    actions: {
      new: {
        async handler(ctx) {
          if (!ctx.meta.deploymentID) {
            throw new Error("No deploymentID specified");
          }
          console.log(ctx);
        },
      },
    },

    created() {
      mongoose.connect(process.env.MONGO_URI);
    },
  };
};
