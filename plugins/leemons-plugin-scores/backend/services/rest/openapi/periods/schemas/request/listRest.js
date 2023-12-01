// automatic hash: 93f6b0ded90d591dccd05f2c3350c133e219a3de88fac7f48b7b941c63e4b0b2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    size: {
      type: 'string',
      minLength: 1,
    },
    page: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['size', 'page'],
};

module.exports = { schema };
