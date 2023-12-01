// automatic hash: 51a7960d20d1f09e987142cd6f308723ede62502ee81b26d05b430856cfe0ab7
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
    center: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['page', 'size', 'center'],
};

module.exports = { schema };
