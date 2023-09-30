/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { pluginName } = require('../config/constants');

const { Readable } = require('stream');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.test`,
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    testAction: {
      rest: {
        path: '/:id',
        method: 'GET',
      },
      async handler(ctx) {
        // console.log(ctx.options.parentCtx.params.req.rawHeaders);
        console.log('multipart', ctx.$multipart);
        const data = 'This is some mock data';
        return new Readable({
          read() {
            this.push(data);
            this.push(null);
          },
        });
      },
    },
  },
};
