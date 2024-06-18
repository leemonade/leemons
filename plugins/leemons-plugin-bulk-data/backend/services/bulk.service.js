// * Conventional leemons. Uncomment if the other solution does not work

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');

const { pluginName } = require('../config/constants');
const restActions = require('./rest/bulk.rest');
const { loadFromTemplateURL } = require('../core/importHandlers');

module.exports = {
  name: `${pluginName}.bulk`,
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: {},
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
    loadFromTemplateURL: {
      async handler(ctx) {
        const { templateURL, shareLibraryAssetsWithTeacherProfile, onFinishData } = ctx.params;
        loadFromTemplateURL({
          templateURL,
          shareLibraryAssetsWithTeacherProfile,
          onFinishData,
          ctx,
        });
        return true;
      },
    },
  },
};
