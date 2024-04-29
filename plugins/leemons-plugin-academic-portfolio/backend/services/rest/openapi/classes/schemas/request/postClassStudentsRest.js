// automatic hash: 3ae8d3005a67ddd1286cd3bb9e7629a26b5f64fb4c38a05bd40c9fca10c64fab
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    students: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    class: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['students', 'class'],
};

module.exports = { schema };
