/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
// const restActions = require('./rest/common.rest');
const {
  getValuesTags,
  getTags,
  removeAllValuesForTags,
  removeAllTagsForValues,
  removeTagsForValues,
  setTagsToValues,
  addTagsToValues,
  getTagsValues,
  listTags,
} = require('../core/tags');
const { LeemonsMQTTMixin } = require('leemons-mqtt');

/** @type {ServiceSchema} */
module.exports = {
  name: 'common.tags',
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
    // ...restActions,
    addTagsToValues: {
      handler(ctx) {
        return addTagsToValues({ ...ctx.params, ctx });
      },
    },
    getTags: {
      handler(ctx) {
        return getTags({ ...ctx.params, ctx });
      },
    },
    getTagsValues: {
      handler(ctx) {
        return getTagsValues({ ...ctx.params, ctx });
      },
    },
    getValuesTags: {
      handler(ctx) {
        return getValuesTags({ ...ctx.params, ctx });
      },
    },
    listTags: {
      handler(ctx) {
        return listTags({ ...ctx.params, ctx });
      },
    },
    removeAllValuesForTags: {
      handler(ctx) {
        return removeAllValuesForTags({ ...ctx.params, ctx });
      },
    },
    removeAllTagsForValues: {
      handler(ctx) {
        return removeAllTagsForValues({ ...ctx.params, ctx });
      },
    },
    removeTagsForValues: {
      handler(ctx) {
        return removeTagsForValues({ ...ctx.params, ctx });
      },
    },
    setTagsToValues: {
      handler(ctx) {
        return setTagsToValues({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
