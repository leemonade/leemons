const { LeemonsOpenApiMixin } = require('@leemons/open-api');

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
