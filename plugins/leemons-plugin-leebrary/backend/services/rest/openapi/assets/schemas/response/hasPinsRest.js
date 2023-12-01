// automatic hash: 761f878d54c51fd020ce0ff087d8d93f435c13c6f57956003c82c48ef314ef65
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    hasPins: {
      type: 'boolean',
    },
  },
  required: ['status', 'hasPins'],
};

module.exports = { schema };
