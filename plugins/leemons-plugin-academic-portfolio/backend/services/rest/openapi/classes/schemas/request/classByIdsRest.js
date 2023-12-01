// automatic hash: efa72861a3f062495ee93212bb6155564f13c03ab40e7584f3de346fd9fbbe1c
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['ids'],
};

module.exports = { schema };
