// automatic hash: c65bbe55def5b4404e24ab33562712d02e033e32feb9a97046ce3c45ee1485f2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    keys: {},
    keysStartsWith: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    locale: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['keysStartsWith', 'locale'],
};

module.exports = { schema };
