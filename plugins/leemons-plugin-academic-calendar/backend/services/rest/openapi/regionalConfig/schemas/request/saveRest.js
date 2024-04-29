// automatic hash: 5b6030c9ee8a823a2615448ab1472bd73ccffef849442f9e55dfe641a0ce1425
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    center: {
      type: 'string',
      minLength: 1,
    },
    daysOffEvents: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    localEvents: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    regionalEvents: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: [
    'name',
    'center',
    'daysOffEvents',
    'localEvents',
    'regionalEvents',
  ],
};

module.exports = { schema };
