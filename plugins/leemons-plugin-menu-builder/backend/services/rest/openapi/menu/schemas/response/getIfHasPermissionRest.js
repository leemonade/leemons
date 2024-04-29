// automatic hash: 5225b4a33d8f9806fa6ad6941c2ae01955cda4811ab9acefb592b92f00f33d75
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    menu: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'menu'],
};

module.exports = { schema };
