// automatic hash: e3385203b8170f68d4a46868181394b34eeac1554279324740c090a0d75c6fe3
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    urls: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
  },
  required: ['status', 'urls'],
};

module.exports = { schema };
