// automatic hash: d6180d794d60b15cd8f72b7c0c92a4f93c6f36a94a6d9e3f0edb3d4c99125ae3
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    sysName: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['status', 'sysName'],
};

module.exports = { schema };
