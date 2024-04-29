// automatic hash: 50c57c6d7e858f6e387b3b4182db521df895c80eb7ec9f75112af2ab879ef504
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    status: {
      type: 'number',
    },
    user: {
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
        isSuperAdmin: {
          type: 'boolean',
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
        'isSuperAdmin',
      ],
    },
    jwtToken: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['status', 'user', 'jwtToken'],
};

module.exports = { schema };
