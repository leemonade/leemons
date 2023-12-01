// automatic hash: 8c3e2b30600b6b28e360654e721d9fba3f3bd0c868a62579d40c6642eab72617
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
      type: 'array',
      uniqueItems: true,
      minItems: 1,
      items: {
        required: ['q', 'a', 'h'],
        properties: {
          q: {
            type: 'string',
            minLength: 1,
          },
          a: {
            type: 'string',
            minLength: 1,
          },
          h: {
            type: 'string',
            minLength: 1,
          },
        },
      },
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
