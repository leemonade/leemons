// automatic hash: 6b0e306c32efa52f37afbcbb0975fa1c4b4f8ab1eb4d4161c6128bce2313fa75
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    data: {
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
        surnames: {
          type: 'string',
          minLength: 1,
        },
        email: {
          type: 'string',
          minLength: 1,
        },
        birthdate: {
          type: 'object',
          properties: {},
          required: [],
        },
        locale: {
          type: 'string',
          minLength: 1,
        },
        active: {
          type: 'boolean',
        },
        gender: {
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
        avatar: {
          type: 'string',
          minLength: 1,
        },
        avatarAsset: {
          type: 'string',
          minLength: 1,
        },
      },
      required: [
        '_id',
        'id',
        'deploymentID',
        'name',
        'surnames',
        'email',
        'birthdate',
        'locale',
        'active',
        'gender',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'avatar',
        'avatarAsset',
      ],
    },
  },
  required: ['status', 'data'],
};

module.exports = { schema };
