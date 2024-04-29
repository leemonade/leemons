// automatic hash: 98ef5c5f87e2048b609236896cd01bf080b944a04c146b275d8f8129f6bef17f
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    gradeScale: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          minLength: 1,
        },
        deploymentID: {
          type: 'string',
          minLength: 1,
        },
        number: {
          type: 'number',
        },
        description: {
          type: 'string',
          minLength: 1,
        },
        grade: {
          type: 'string',
          minLength: 1,
        },
        order: {
          type: 'number',
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
        'id',
        'deploymentID',
        'number',
        'description',
        'grade',
        'order',
        '_id',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
      ],
    },
  },
  required: ['status', 'gradeScale'],
};

module.exports = { schema };
