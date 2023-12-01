// automatic hash: 84fd0979d851ac53f90801d3aab7c86bfcd71130016371eb214b91d2d621c3f2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    program: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['program'],
};

module.exports = { schema };
