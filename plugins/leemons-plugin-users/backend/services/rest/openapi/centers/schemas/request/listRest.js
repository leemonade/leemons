// automatic hash: 33c4e7e37cd10881f7132bf24bade118aa8128969b464ed86ac4a0861c7648be
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
    withLimits: {
      type: 'boolean',
    },
  },
  required: ['page', 'size', 'withLimits'],
};

module.exports = { schema };
