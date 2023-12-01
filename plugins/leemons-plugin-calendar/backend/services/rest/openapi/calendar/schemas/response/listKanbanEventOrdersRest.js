// automatic hash: 0cbaa7df41c2dc080e2149d33de855fc61c3ddc7b43695526a12fe2a5341fb2e
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    orders: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'orders'],
};

module.exports = { schema };
