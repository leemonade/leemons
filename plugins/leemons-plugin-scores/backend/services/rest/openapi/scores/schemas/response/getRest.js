// automatic hash: bb065f8919740f2c4134cf4e88a33884ba9cef2e15a415b59062af2c76733fe2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    scores: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'scores'],
};

module.exports = { schema };
