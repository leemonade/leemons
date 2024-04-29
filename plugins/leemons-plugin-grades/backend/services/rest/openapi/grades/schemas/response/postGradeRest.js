// automatic hash: 49c04508933c176cb039dff5e7fefb42849049f419100e92d32f3298e9cee611
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    grade: {
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
        name: {
          type: 'string',
          minLength: 1,
        },
        type: {
          type: 'string',
          minLength: 1,
        },
        isPercentage: {
          type: 'boolean',
        },
        center: {
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
        scales: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
        tags: {
          type: 'array',
          items: {
            required: [],
            properties: {},
          },
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'type',
        'isPercentage',
        'center',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'scales',
        'tags',
      ],
    },
  },
  required: ['status', 'grade'],
};

module.exports = { schema };
