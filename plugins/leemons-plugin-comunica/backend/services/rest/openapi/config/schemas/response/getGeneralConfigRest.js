// automatic hash: ab5b8df7b66a4742d43bc34233f8f0a0306d9ba41b527f5550706960a02b986f
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    config: {
      type: 'object',
      properties: {
        enabled: {
          type: 'boolean',
        },
      },
      required: ['enabled'],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };
