/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { createWriteStream } = require('fs');
const { Readable } = require('stream');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/actions.rest');
const { add, exist, addMany } = require('../core/actions');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.actions',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],

  actions: {
    ...restActions,
    test: {
      async handler(ctx) {
        console.log('estamos en users', ctx.params.image);
        new Readable();
        const writeStream = createWriteStream('./gatitos.png');
        ctx.params.image.pipe(writeStream);
      },
    },
    add: {
      async handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    exist: {
      async handler(ctx) {
        return exist({ ...ctx.params, ctx });
      },
    },
    addMany: {
      async handler(ctx) {
        return addMany({ ...ctx.params, ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
