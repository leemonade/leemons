// automatic hash: df08063be1d45dab4ffa3556dfa95c91d0ce31f01df1ad96186a2980f5c49113
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
        secondSurname: {
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
        status: {
          type: 'string',
          minLength: 1,
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
        password: {
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
        'secondSurname',
        'email',
        'birthdate',
        'locale',
        'active',
        'status',
        'gender',
        'isDeleted',
        'createdAt',
        'updatedAt',
        '__v',
        'avatar',
        'avatarAsset',
        'password',
      ],
    },
  },
  required: ['status', 'user'],
};

module.exports = { schema };
