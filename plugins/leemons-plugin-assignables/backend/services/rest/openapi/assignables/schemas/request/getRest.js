// automatic hash: cc867f203847c3f77e9b960d33917f2413b4ead4271b2f14766f48bfc810749d
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    ids: {
      type: 'string',
      minLength: 1,
    },
    withFiles: {
      type: 'string',
      minLength: 1,
    },
    deleted: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['ids', 'withFiles', 'deleted'],
};

module.exports = { schema };
