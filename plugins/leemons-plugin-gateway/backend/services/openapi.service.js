const { LeemonsOpenApiMixin } = require('@leemons/openapi');

module.exports = {
  name: 'openapi',
  mixins: [LeemonsOpenApiMixin],
  settings: {
    openapi: {
      info: {
        description: '**The ultimate open source learning platform**',
        title: 'Leemons',
      },
      components: {},
    },
  },
};
