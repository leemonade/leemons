// automatic hash: b5b95b954eeeda315e10002f72587624c770c12b41d17f8c78b2dcb0fc60d9a4
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
      properties: {
        published: {
          type: 'boolean',
        },
        showPublic: {
          type: 'boolean',
        },
        onlyPinned: {
          type: 'boolean',
        },
      },
      required: ['published', 'showPublic', 'onlyPinned'],
    },
  },
  required: ['assets', 'filters'],
};

module.exports = { schema };
