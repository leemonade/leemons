// automatic hash: c087c012b385690c77dfaa4af288e202edbd83e1bb04edc2a1016071c3fd55e3
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['id', 'password'],
};

module.exports = { schema };
