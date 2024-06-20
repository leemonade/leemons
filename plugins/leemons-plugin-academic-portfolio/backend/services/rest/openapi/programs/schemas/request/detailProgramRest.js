// automatic hash: 9e5e43674831ebd55625548740924da125f82d64b12ccc8cf142006eaf1fdc9e
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    withClasses: {
      type: 'string',
      minLength: 1,
    },
    id: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['withClasses', 'id'],
};

module.exports = { schema };
