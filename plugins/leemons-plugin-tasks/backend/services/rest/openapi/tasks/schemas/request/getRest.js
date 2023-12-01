// automatic hash: b49511c7dea106c74f8bfe3800d661f964eb3f98f4cc55c11202722177d77a62
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    columns: {
      type: 'string',
      minLength: 1,
    },
    id: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['columns', 'id'],
};

module.exports = { schema };
