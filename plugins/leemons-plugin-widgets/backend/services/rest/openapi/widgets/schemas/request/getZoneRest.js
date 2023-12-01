// automatic hash: 247f5021097d6f19bbeee0406b158b5ecbbeb2670b6155ddb898fe80351e57d2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    key: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['key'],
};

module.exports = { schema };
