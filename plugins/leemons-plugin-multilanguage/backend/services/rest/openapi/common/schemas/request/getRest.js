// automatic hash: ebfa04d21c68df6f18ebce94a5db87559d5bfdc9b4d721232f46c90d70778ae8
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
      type: 'string',
      minLength: 1,
    },
  },
  required: ['keysStartsWith', 'locale'],
};

module.exports = { schema };
