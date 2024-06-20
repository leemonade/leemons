// automatic hash: d8be033bf9ff035787396589497d2690f74e61429a6bcb51831ee93fbb6e2a98
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    id: {
      type: 'string',
      minLength: 1,
    },
    deploymentID: {
      type: 'string',
      minLength: 1,
    },
    provider: {
      type: 'string',
      minLength: 1,
    },
    type: {
      type: 'string',
      minLength: 1,
    },
    extension: {
      type: 'string',
      minLength: 1,
    },
    name: {
      type: 'string',
      minLength: 1,
    },
    size: {
      type: 'number',
    },
    uri: {
      type: 'string',
      minLength: 1,
    },
    isFolder: {
      type: 'boolean',
    },
    metadata: {
      type: 'string',
      minLength: 1,
    },
    _id: {
      type: 'object',
      properties: {
        valueOf: {},
      },
      required: ['valueOf'],
    },
    isDeleted: {
      type: 'boolean',
    },
    deletedAt: {},
    createdAt: {
      type: 'object',
      properties: {},
      required: [],
    },
    updatedAt: {
      type: 'object',
      properties: {},
      required: [],
    },
    __v: {
      type: 'number',
    },
  },
  required: [
    'status',
    'id',
    'deploymentID',
    'provider',
    'type',
    'extension',
    'name',
    'size',
    'uri',
    'isFolder',
    'metadata',
    '_id',
    'isDeleted',
    'createdAt',
    'updatedAt',
    '__v',
  ],
};

module.exports = { schema };
