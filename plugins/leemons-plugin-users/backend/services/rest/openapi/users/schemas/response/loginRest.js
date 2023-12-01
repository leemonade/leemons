// automatic hash: d374b6cca33a7dc240df95f40519bb696dd7dba19a5acec42af0387ab83eecf3
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
        password: {
          type: 'string',
          minLength: 1,
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
        'password',
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
