// automatic hash: ea4c583d53dd275b71db1c869501020e83c3007c2053c8f7431475c2ffcb9e75
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    assignableInstances: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'assignableInstances'],
};

module.exports = { schema };
