// automatic hash: f8e0d53d47e8f174fa59109cfe45e3b0f88048c4256c8e071805bcfa7c9926eb
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    page: {
      type: 'string',
      minLength: 1,
    },
    size: {
      type: 'string',
      minLength: 1,
    },
    program: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['page', 'size', 'program'],
};

module.exports = { schema };
