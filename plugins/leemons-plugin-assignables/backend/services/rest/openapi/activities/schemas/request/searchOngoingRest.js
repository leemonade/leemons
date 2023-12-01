// automatic hash: 86e028c6b28258848580cd37fc2e5a2b5d24b985699d28d6e030ec81f13489a0
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    isTeacher: {
      type: 'string',
      minLength: 1,
    },
    isArchived: {
      type: 'string',
      minLength: 1,
    },
    offset: {
      type: 'string',
      minLength: 1,
    },
    limit: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['isTeacher', 'isArchived', 'offset', 'limit'],
};

module.exports = { schema };
