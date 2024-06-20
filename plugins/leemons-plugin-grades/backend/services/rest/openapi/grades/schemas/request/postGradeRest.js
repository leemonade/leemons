// automatic hash: 1de0b2bc013d0459919d7d178e51563bb177a8bc70c0546b8e91456e6980d0ef
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    center: {
      type: 'string',
      minLength: 1,
    },
    scales: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    type: {
      type: 'string',
      minLength: 1,
    },
    isPercentage: {
      type: 'boolean',
    },
  },
  required: ['center', 'scales', 'name', 'type', 'isPercentage'],
};

module.exports = { schema };
