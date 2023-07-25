/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./platform.rest');
const {
  getLocales,
  addLocale,
  setDefaultLocale,
  query,
  setName,
  getName,
  setEmail,
  getEmail,
  setHostname,
  getHostname,
  setHostnameApi,
  getHostnameApi,
  setEmailLogo,
  getEmailLogo,
  setSquareLogo,
  getSquareLogo,
  getContactName,
  setContactName,
  setContactPhone,
  setContactEmail,
  getContactPhone,
  getContactEmail,
  getDefaultLocale,
  setLandscapeLogo,
  getLandscapeLogo,
  getEmailWidthLogo,
  setEmailWidthLogo,
  setAppearanceDarkMode,
  getAppearanceDarkMode,
  setAppearanceMainColor,
  getAppearanceMainColor,
  setAppearanceMenuMainColor,
  getAppearanceMenuMainColor,
  setAppearanceMenuDrawerColor,
  getAppearanceMenuDrawerColor,
  getPicturesEmptyStates,
  setPicturesEmptyStates,
} = require('../core/platform');

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
  ],

  actions: {
    ...restActions,
    query: {
      async handler(ctx) {
        return query({ ...ctx.params, ctx });
      },
    },
    setName: {
      async handler(ctx) {
        return setName({ ...ctx.params, ctx });
      },
    },
    getName: {
      async handler(ctx) {
        return getName({ ...ctx.params, ctx });
      },
    },
    setEmail: {
      async handler(ctx) {
        return setEmail({ ...ctx.params, ctx });
      },
    },
    getEmail: {
      async handler(ctx) {
        return getEmail({ ...ctx.params, ctx });
      },
    },
    addLocale: {
      async handler(ctx) {
        return addLocale({ ...ctx.params, ctx });
      },
    },
    getLocales: {
      async handler(ctx) {
        return getLocales({ ...ctx.params, ctx });
      },
    },
    setHostname: {
      async handler(ctx) {
        return setHostname({ ...ctx.params, ctx });
      },
    },
    getHostname: {
      async handler(ctx) {
        return getHostname({ ...ctx.params, ctx });
      },
    },
    setHostnameApi: {
      async handler(ctx) {
        return setHostnameApi({ ...ctx.params, ctx });
      },
    },
    getHostnameApi: {
      async handler(ctx) {
        return getHostnameApi({ ...ctx.params, ctx });
      },
    },
    setEmailLogo: {
      async handler(ctx) {
        return setEmailLogo({ ...ctx.params, ctx });
      },
    },
    getEmailLogo: {
      async handler(ctx) {
        return getEmailLogo({ ...ctx.params, ctx });
      },
    },
    setSquareLogo: {
      async handler(ctx) {
        return setSquareLogo({ ...ctx.params, ctx });
      },
    },
    getSquareLogo: {
      async handler(ctx) {
        return getSquareLogo({ ...ctx.params, ctx });
      },
    },
    getContactName: {
      async handler(ctx) {
        return getContactName({ ...ctx.params, ctx });
      },
    },
    setContactName: {
      async handler(ctx) {
        return setContactName({ ...ctx.params, ctx });
      },
    },
    setContactPhone: {
      async handler(ctx) {
        return setContactPhone({ ...ctx.params, ctx });
      },
    },
    setContactEmail: {
      async handler(ctx) {
        return setContactEmail({ ...ctx.params, ctx });
      },
    },
    getContactPhone: {
      async handler(ctx) {
        return getContactPhone({ ...ctx.params, ctx });
      },
    },
    getContactEmail: {
      async handler(ctx) {
        return getContactEmail({ ...ctx.params, ctx });
      },
    },
    setDefaultLocale: {
      async handler(ctx) {
        return setDefaultLocale({ ...ctx.params, ctx });
      },
    },
    getDefaultLocale: {
      async handler(ctx) {
        return getDefaultLocale({ ...ctx.params, ctx });
      },
    },
    setLandscapeLogo: {
      async handler(ctx) {
        return setLandscapeLogo({ ...ctx.params, ctx });
      },
    },
    getLandscapeLogo: {
      async handler(ctx) {
        return getLandscapeLogo({ ...ctx.params, ctx });
      },
    },
    getEmailWidthLogo: {
      async handler(ctx) {
        return getEmailWidthLogo({ ...ctx.params, ctx });
      },
    },
    setEmailWidthLogo: {
      async handler(ctx) {
        return setEmailWidthLogo({ ...ctx.params, ctx });
      },
    },
    setAppearanceDarkMode: {
      async handler(ctx) {
        return setAppearanceDarkMode({ ...ctx.params, ctx });
      },
    },
    getAppearanceDarkMode: {
      async handler(ctx) {
        return getAppearanceDarkMode({ ...ctx.params, ctx });
      },
    },
    setAppearanceMainColor: {
      async handler(ctx) {
        return setAppearanceMainColor({ ...ctx.params, ctx });
      },
    },
    getAppearanceMainColor: {
      async handler(ctx) {
        return getAppearanceMainColor({ ...ctx.params, ctx });
      },
    },
    setAppearanceMenuMainColor: {
      async handler(ctx) {
        return setAppearanceMenuMainColor({ ...ctx.params, ctx });
      },
    },
    getAppearanceMenuMainColor: {
      async handler(ctx) {
        return getAppearanceMenuMainColor({ ...ctx.params, ctx });
      },
    },
    setAppearanceMenuDrawerColor: {
      async handler(ctx) {
        return setAppearanceMenuDrawerColor({ ...ctx.params, ctx });
      },
    },
    getAppearanceMenuDrawerColor: {
      async handler(ctx) {
        return getAppearanceMenuDrawerColor({ ...ctx.params, ctx });
      },
    },
    getPicturesEmptyStates: {
      async handler(ctx) {
        return getPicturesEmptyStates({ ...ctx.params, ctx });
      },
    },
    setPicturesEmptyStates: {
      async handler(ctx) {
        return setPicturesEmptyStates({ ...ctx.params, ctx });
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
