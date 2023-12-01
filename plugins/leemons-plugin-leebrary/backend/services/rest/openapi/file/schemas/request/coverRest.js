// automatic hash: ae2a9e5eed56f435c9d391424ffa7a6133d4ff1d2c94222a19ce2519b0150f94
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    t: {
      type: 'string',
      minLength: 1,
    },
    assetId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['t', 'assetId'],
};

module.exports = { schema };
