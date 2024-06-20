// automatic hash: 983899848656d9f7d9042f24324777f117eebbaab767766a1632b763d84acb12
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    name: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['status', 'name'],
};

module.exports = { schema };
