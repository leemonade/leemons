// automatic hash: 54ef9778f739050c5f4f59dbd62c8244a359e90a9cbb33561e8914d352717869
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    subject: {
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
        program: {
          type: 'string',
          minLength: 1,
        },
        course: {
          type: 'string',
          minLength: 1,
        },
        color: {
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
        icon: {
          type: 'string',
          minLength: 1,
        },
        image: {
          type: 'string',
          minLength: 1,
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'program',
        'course',
        'color',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'icon',
        'image',
      ],
    },
  },
  required: ['status', 'subject'],
};

module.exports = { schema };
