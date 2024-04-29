// automatic hash: 760d58792e43b4e7faf1f95a48d33efa56e835fca98998645f594164ed9ef8e0
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 1,
    },
    locale: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['id', 'locale'],
};

module.exports = { schema };
