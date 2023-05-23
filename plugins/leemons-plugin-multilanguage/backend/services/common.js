"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require("leemons-mongodb");
const { commonModel, localesModel, contentsModel } = require("../models");

const LocalizationProvider = require("../src/services/localization");

const model = leemons.query("plugins_multilanguage::common");

function getProvider() {
  const provider = new LocalizationProvider({
    model,
    caller: this.calledFrom,
  });

  // Prevent the modification of the provider, so the caller can't be modified
  Object.seal(provider);

  return provider;
}

/** @type {ServiceSchema} */
module.exports = () => {
  return {
    name: "multilanguage-common",
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
          method: "GET",
          path: "/hello",
        },
        async handler(ctx) {
          // const test = await ctx.tx.db.Test.create({ name: "miau" });

          const test = await ctx.tx.db.Test.findByIdAndUpdate(
            "646b5caf489258370109cae1",
            { name: "pepito mola" }
          );

          // throw new Error("miau");
        },
      },
    },
    created() {
      mongoose.connect(process.env.MONGO_URI);
    },
  };
};
