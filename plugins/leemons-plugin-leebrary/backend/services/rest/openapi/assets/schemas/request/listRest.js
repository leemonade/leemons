// automatic hash: cbbce01e51253f7250aac5115d5bfa5a26ea9d0dbd3d7899d32e5ed9823863e7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      minLength: 1,
    },
    category: {
      type: 'string',
      minLength: 1,
    },
    criteria: {
      type: 'string',
    },
    published: {
      type: 'string',
      minLength: 1,
    },
    showPublic: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['type', 'category', 'criteria', 'published', 'showPublic'],
};

module.exports = { schema };
