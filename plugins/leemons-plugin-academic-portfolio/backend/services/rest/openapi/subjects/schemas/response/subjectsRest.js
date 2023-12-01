// automatic hash: 7b7664cfe69c0093da19837e4f79d27a3c9ec88e4a2fa1f2f905f8de01bd8317
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
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
