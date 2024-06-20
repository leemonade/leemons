// automatic hash: 34316773ab751ecc66b0de55dff96a453b5ad5cfce105fe94bf3d189a7dd578a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    keys: {},
    keysStartsWith: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    locale: {},
  },
  required: ['keysStartsWith'],
};

module.exports = { schema };
