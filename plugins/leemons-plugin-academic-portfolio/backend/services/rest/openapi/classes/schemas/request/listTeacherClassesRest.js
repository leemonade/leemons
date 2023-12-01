// automatic hash: 2012e94c64dc9df3a26763d878381597e949d47d8416b7fa6fd68cbcedaa7774
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
    id: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['page', 'size', 'id'],
};

module.exports = { schema };
