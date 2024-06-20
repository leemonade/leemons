// automatic hash: 2b543ac0ca4d9d5a436af71f7b413425f72e54e93f53ea3d7ea459d12f20bad7
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
    },
    type: {
      type: 'string',
      minLength: 1,
    },
    size: {
      type: 'number',
    },
    isFolder: {
      type: 'boolean',
    },
    filePaths: {
      type: 'array',
      items: {
        required: [],
        properties: {},
      },
    },
    pathsInfo: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  required: ['name', 'type', 'size', 'isFolder', 'filePaths', 'pathsInfo'],
};

module.exports = { schema };
