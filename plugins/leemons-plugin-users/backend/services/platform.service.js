/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const Rest = require('./platform.rest');
const platformService = require('../core/platform');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.platform',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
    Rest,
  ],

  actions: {
    query: {
      async handler(ctx) {
        return platformService.query({ ...ctx.params, ctx });
      },
    },
    setName: {
      async handler(ctx) {
        return platformService.setName({ ...ctx.params, ctx });
      },
    },
    getName: {
      async handler(ctx) {
        return platformService.getName({ ctx });
      },
    },
    setEmail: {
      async handler(ctx) {
        return platformService.setEmail({ ...ctx.params, ctx });
      },
    },
    getEmail: {
      async handler(ctx) {
        return platformService.getEmail({ ctx });
      },
    },
    addLocale: {
      async handler(ctx) {
        return platformService.addLocale({ ...ctx.params, ctx });
      },
    },
    getLocales: {
      async handler(ctx) {
        return platformService.getLocales({ ctx });
      },
    },
    setHostname: {
      async handler(ctx) {
        return platformService.setHostname({ ...ctx.params, ctx });
      },
    },
    getHostname: {
      async handler(ctx) {
        return platformService.getHostname({ ctx });
      },
    },
    setHostnameApi: {
      async handler(ctx) {
        return platformService.setHostnameApi({ ...ctx.params, ctx });
      },
    },
    getHostnameApi: {
      async handler(ctx) {
        return platformService.getHostnameApi({ ctx });
      },
    },
    setEmailLogo: {
      async handler(ctx) {
        return platformService.setEmailLogo({ ...ctx.params, ctx });
      },
    },
    getEmailLogo: {
      async handler(ctx) {
        return platformService.getEmailLogo({ ctx });
      },
    },
    setSquareLogo: {
      async handler(ctx) {
        return platformService.setSquareLogo({ ...ctx.params, ctx });
      },
    },
    getSquareLogo: {
      async handler(ctx) {
        return platformService.getSquareLogo({ ctx });
      },
    },
    getContactName: {
      async handler(ctx) {
        return platformService.getContactName({ ctx });
      },
    },
    setContactName: {
      async handler(ctx) {
        return platformService.setContactName({ ...ctx.params, ctx });
      },
    },
    setContactPhone: {
      async handler(ctx) {
        return platformService.setContactPhone({ ...ctx.params, ctx });
      },
    },
    setContactEmail: {
      async handler(ctx) {
        return platformService.setContactEmail({ ...ctx.params, ctx });
      },
    },
    getContactPhone: {
      async handler(ctx) {
        return platformService.getContactPhone({ ctx });
      },
    },
    getContactEmail: {
      async handler(ctx) {
        return platformService.getContactEmail({ ctx });
      },
    },
    setDefaultLocale: {
      async handler(ctx) {
        return platformService.setDefaultLocale({ ...ctx.params, ctx });
      },
    },
    getDefaultLocale: {
      async handler(ctx) {
        return platformService.getDefaultLocale({ ctx });
      },
    },
    setLandscapeLogo: {
      async handler(ctx) {
        return platformService.setLandscapeLogo({ ...ctx.params, ctx });
      },
    },
    getLandscapeLogo: {
      async handler(ctx) {
        return platformService.getLandscapeLogo({ ctx });
      },
    },
    getEmailWidthLogo: {
      async handler(ctx) {
        return platformService.getEmailWidthLogo({ ctx });
      },
    },
    setEmailWidthLogo: {
      async handler(ctx) {
        return platformService.setEmailWidthLogo({ ...ctx.params, ctx });
      },
    },
    setAppearanceDarkMode: {
      async handler(ctx) {
        return platformService.setAppearanceDarkMode({ ...ctx.params, ctx });
      },
    },
    getAppearanceDarkMode: {
      async handler(ctx) {
        return platformService.getAppearanceDarkMode({ ctx });
      },
    },
    setAppereanceMainColor: {
      async handler(ctx) {
        return platformService.setAppearanceMainColor({ ...ctx.params, ctx });
      },
    },
    getAppereanceMainColor: {
      async handler(ctx) {
        return platformService.getAppearanceMainColor({ ctx });
      },
    },
    setAppereanceMenuMainColor: {
      async handler(ctx) {
        return platformService.setAppearanceMenuMainColor({ ...ctx.params, ctx });
      },
    },
    getAppereanceMenuMainColor: {
      async handler(ctx) {
        return platformService.getAppearanceMenuMainColor({ ctx });
      },
    },
    setAppereanceMenuDrawerColor: {
      async handler(ctx) {
        return platformService.setAppearanceMenuDrawerColor({ ...ctx.params, ctx });
      },
    },
    getAppereanceMenuDrawerColor: {
      async handler(ctx) {
        return platformService.getAppearanceMenuDrawerColor({ ctx });
      },
    },
    getPicturesEmptyStates: {
      async handler(ctx) {
        return platformService.getPicturesEmptyStates({ ctx });
      },
    },
    setPicturesEmptyStates: {
      async handler(ctx) {
        return platformService.setPicturesEmptyStates({ ...ctx.params, ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
