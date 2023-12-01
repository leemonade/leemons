// automatic hash: 23bccef8172cc202f28e3e2bc8f69986668007edeefa56fd00cb3cd5a58c2317
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    authorization: {
      type: 'string',
      minLength: 1,
    },
    id: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['authorization', 'id'],
};

module.exports = { schema };
