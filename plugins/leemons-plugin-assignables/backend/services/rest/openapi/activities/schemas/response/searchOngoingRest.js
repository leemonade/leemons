// automatic hash: 9682c4a79a273aa102434adf549dc1a1addad04961ab1f2cf584b580ac270598
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    activities: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        count: {
          type: 'number',
        },
        totalCount: {
          type: 'number',
        },
      },
      required: ['items', 'count', 'totalCount'],
    },
  },
  required: ['status', 'activities'],
};

module.exports = { schema };
