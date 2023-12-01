// automatic hash: e13498698a3f50992d1d99ae33424af671fe8a7301cb654b594420f511626078
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
        muted: {
          type: 'boolean',
        },
      },
      required: ['muted'],
    },
  },
  required: ['status', 'config'],
};

module.exports = { schema };
