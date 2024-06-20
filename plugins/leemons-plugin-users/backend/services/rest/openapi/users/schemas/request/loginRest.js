// automatic hash: 300739bc98ab4a79853d3c5a67f24c3e0e3ffe03642fcc0d7278f16dfce5c8ce
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['email', 'password'],
};

module.exports = { schema };
