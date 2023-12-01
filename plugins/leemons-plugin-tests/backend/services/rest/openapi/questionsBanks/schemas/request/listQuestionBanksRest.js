// automatic hash: 5d2b5f906861e8fe5d62d382966a62eb2a8fb37a1ccd1c84155f545b61e855d1
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
    published: {
      type: 'boolean',
    },
    subjects: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['page', 'size', 'published', 'subjects'],
};

module.exports = { schema };
