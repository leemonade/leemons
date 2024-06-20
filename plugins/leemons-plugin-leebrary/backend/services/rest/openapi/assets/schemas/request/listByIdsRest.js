// automatic hash: d605db14fa092b7ebf2e4a2e1dbb23b6c55fdd4a6f3f4da22c958d93c0a28ae9
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    assets: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    filters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  required: ['assets', 'filters'],
};

module.exports = { schema };
