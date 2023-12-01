// automatic hash: 53fe9014d6eebd59e86628400e932ce9aa24e56fadf4df1e40e8947f987d8b2b
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        user: {
          type: 'string',
          minLength: 1,
        },
      },
      required: ['tags', 'user'],
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
