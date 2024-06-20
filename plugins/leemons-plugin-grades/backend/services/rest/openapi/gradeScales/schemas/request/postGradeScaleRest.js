// automatic hash: 9f4177c2479b0ea17f76237b7da0a2b9806c990b07535271d96b48a16b585f05
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    description: {
      type: 'string',
      minLength: 1,
    },
    number: {
      type: 'number',
    },
    order: {
      type: 'number',
    },
    grade: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['description', 'number', 'order', 'grade'],
};

module.exports = { schema };
