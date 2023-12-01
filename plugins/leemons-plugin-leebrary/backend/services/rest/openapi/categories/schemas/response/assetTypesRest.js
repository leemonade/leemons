// automatic hash: 1883bd0c8cf488c422133aa2a53e058c3002f4a41dfc3800b36fd25c1ee5882c
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    types: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'types'],
};

module.exports = { schema };
