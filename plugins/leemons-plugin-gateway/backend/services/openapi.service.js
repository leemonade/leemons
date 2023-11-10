const { LeemonsOpenApiMixin } = require('@leemons/open-api');

module.exports = {
  name: 'openapi',
  mixins: [LeemonsOpenApiMixin],
  settings: {
    openapi: {
      info: {
        description: 'Leemons API',
        title: 'Leemons',
      },
      components: {},
    },
  },
};
