// automatic hash: 3ba4783867b78e740013f76b22acc51e0b3f5881483026a6503e19f287153919
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    page: {
      type: 'number',
    },
    size: {
      type: 'number',
    },
  },
  required: ['page', 'size'],
};

module.exports = { schema };
