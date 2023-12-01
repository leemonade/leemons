// automatic hash: 86fcebfa1eb59244d0bae15c8347207f9f0d2b87258545c0146e158f44bfa87a
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    message: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['status', 'message'],
};

module.exports = { schema };
