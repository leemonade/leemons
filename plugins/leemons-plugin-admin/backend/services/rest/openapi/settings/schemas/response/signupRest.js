// automatic hash: 261dd187eff94773fd2d57de682d2ecd9aeea9d74c0b7eecb48274cad40082b2
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    settings: {
      type: 'object',
      properties: {
        _id: {
          type: 'object',
          properties: {
            valueOf: {},
          },
          required: ['valueOf'],
        },
        id: {
          type: 'string',
          minLength: 1,
        },
        deploymentID: {
          type: 'string',
          minLength: 1,
        },
        configured: {
          type: 'boolean',
        },
        status: {
          type: 'string',
          minLength: 1,
        },
        lang: {
          type: 'string',
          minLength: 1,
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
        '_id',
        'id',
        'deploymentID',
        'configured',
        'status',
        'lang',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
      ],
    },
  },
  required: ['status', 'settings'],
};

module.exports = { schema };
