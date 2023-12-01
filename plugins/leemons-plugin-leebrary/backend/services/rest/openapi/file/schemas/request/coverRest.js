// automatic hash: 17517ac5cef457d37dfe6d1c72e212b5732d76d4407a75e41f4689c9f6ec385b
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    assetId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['assetId'],
};

module.exports = { schema };
